const { ApperClient } = window.ApperSDK;

let apperClient;

const getApperClient = () => {
  if (!apperClient) {
    apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }
  return apperClient;
};

const TABLE_NAME = 'transaction_c';

export const transactionService = {
  async getAll() {
    try {
      const client = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name_c"}},
          {"field": {"Name": "Description_c"}},
          {"field": {"Name": "Amount_c"}},
          {"field": {"Name": "Category_c"}},
          {"field": {"Name": "Type_c"}},
          {"field": {"Name": "Date_c"}}
        ],
        orderBy: [{"fieldName": "Date_c", "sorttype": "DESC"}]
      };
      
      const response = await client.fetchRecords(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data.map(item => ({
        Id: item.Id,
        description: item.Description_c,
        amount: item.Amount_c,
        category: item.Category_c,
        type: item.Type_c,
        date: item.Date_c
      }));
    } catch (error) {
      console.error("Error fetching transactions:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const client = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name_c"}},
          {"field": {"Name": "Description_c"}},
          {"field": {"Name": "Amount_c"}},
          {"field": {"Name": "Category_c"}},
          {"field": {"Name": "Type_c"}},
          {"field": {"Name": "Date_c"}}
        ]
      };
      
      const response = await client.getRecordById(TABLE_NAME, id, params);
      
      if (!response?.data) {
        return null;
      }
      
      const item = response.data;
      return {
        Id: item.Id,
        description: item.Description_c,
        amount: item.Amount_c,
        category: item.Category_c,
        type: item.Type_c,
        date: item.Date_c
      };
    } catch (error) {
      console.error(`Error fetching transaction ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(transactionData) {
    try {
      const client = getApperClient();
      const params = {
        records: [{
          Name_c: `${transactionData.type} - ${transactionData.description}`,
          Description_c: transactionData.description,
          Amount_c: transactionData.amount,
          Category_c: transactionData.category,
          Type_c: transactionData.type,
          Date_c: transactionData.date
        }]
      };
      
      const response = await client.createRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} records:`, failed);
          throw new Error("Failed to create transaction");
        }
        
        if (successful.length > 0) {
          const item = successful[0].data;
          return {
            Id: item.Id,
            description: item.Description_c,
            amount: item.Amount_c,
            category: item.Category_c,
            type: item.Type_c,
            date: item.Date_c
          };
        }
      }
      
      throw new Error("No data returned");
    } catch (error) {
      console.error("Error creating transaction:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, transactionData) {
    try {
      const client = getApperClient();
      const params = {
        records: [{
          Id: id,
          Name_c: `${transactionData.type} - ${transactionData.description}`,
          Description_c: transactionData.description,
          Amount_c: transactionData.amount,
          Category_c: transactionData.category,
          Type_c: transactionData.type,
          Date_c: transactionData.date
        }]
      };
      
      const response = await client.updateRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} records:`, failed);
          throw new Error("Failed to update transaction");
        }
        
        if (successful.length > 0) {
          const item = successful[0].data;
          return {
            Id: item.Id,
            description: item.Description_c,
            amount: item.Amount_c,
            category: item.Category_c,
            type: item.Type_c,
            date: item.Date_c
          };
        }
      }
      
      throw new Error("No data returned");
    } catch (error) {
      console.error("Error updating transaction:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const client = getApperClient();
      const params = { 
        RecordIds: [id]
      };
      
      const response = await client.deleteRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} records:`, failed);
          throw new Error("Failed to delete transaction");
        }
        
        return successful.length > 0;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting transaction:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async getByMonth(monthYear) {
    try {
      const client = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name_c"}},
          {"field": {"Name": "Description_c"}},
          {"field": {"Name": "Amount_c"}},
          {"field": {"Name": "Category_c"}},
          {"field": {"Name": "Type_c"}},
          {"field": {"Name": "Date_c"}}
        ],
        where: [
          {"FieldName": "Date_c", "Operator": "Contains", "Values": [monthYear]}
        ],
        orderBy: [{"fieldName": "Date_c", "sorttype": "DESC"}]
      };
      
      const response = await client.fetchRecords(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data.map(item => ({
        Id: item.Id,
        description: item.Description_c,
        amount: item.Amount_c,
        category: item.Category_c,
        type: item.Type_c,
        date: item.Date_c
      }));
    } catch (error) {
      console.error("Error fetching transactions by month:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getByCategory(category) {
    try {
      const client = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name_c"}},
          {"field": {"Name": "Description_c"}},
          {"field": {"Name": "Amount_c"}},
          {"field": {"Name": "Category_c"}},
          {"field": {"Name": "Type_c"}},
          {"field": {"Name": "Date_c"}}
        ],
        where: [
          {"FieldName": "Category_c", "Operator": "EqualTo", "Values": [category]}
        ],
        orderBy: [{"fieldName": "Date_c", "sorttype": "DESC"}]
      };
      
      const response = await client.fetchRecords(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data.map(item => ({
        Id: item.Id,
        description: item.Description_c,
        amount: item.Amount_c,
        category: item.Category_c,
        type: item.Type_c,
        date: item.Date_c
      }));
    } catch (error) {
      console.error("Error fetching transactions by category:", error?.response?.data?.message || error);
      return [];
    }
  }
};