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

const TABLE_NAME = 'budget_c';

export const budgetService = {
  async getAll() {
    try {
      const client = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name_c"}},
          {"field": {"Name": "Category_c"}},
          {"field": {"Name": "Monthly_Limit_c"}},
          {"field": {"Name": "Month_c"}},
          {"field": {"Name": "Year_c"}}
        ]
      };
      
      const response = await client.fetchRecords(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data.map(item => ({
        Id: item.Id,
        category: item.Category_c,
        monthlyLimit: item.Monthly_Limit_c,
        month: item.Month_c,
        year: item.Year_c
      }));
    } catch (error) {
      console.error("Error fetching budgets:", error?.response?.data?.message || error);
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
          {"field": {"Name": "Category_c"}},
          {"field": {"Name": "Monthly_Limit_c"}},
          {"field": {"Name": "Month_c"}},
          {"field": {"Name": "Year_c"}}
        ]
      };
      
      const response = await client.getRecordById(TABLE_NAME, id, params);
      
      if (!response?.data) {
        return null;
      }
      
      const item = response.data;
      return {
        Id: item.Id,
        category: item.Category_c,
        monthlyLimit: item.Monthly_Limit_c,
        month: item.Month_c,
        year: item.Year_c
      };
    } catch (error) {
      console.error(`Error fetching budget ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(budgetData) {
    try {
      const client = getApperClient();
      const params = {
        records: [{
          Name_c: `${budgetData.category} Budget`,
          Category_c: budgetData.category,
          Monthly_Limit_c: budgetData.monthlyLimit,
          Month_c: budgetData.month,
          Year_c: budgetData.year
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
          throw new Error("Failed to create budget");
        }
        
        if (successful.length > 0) {
          const item = successful[0].data;
          return {
            Id: item.Id,
            category: item.Category_c,
            monthlyLimit: item.Monthly_Limit_c,
            month: item.Month_c,
            year: item.Year_c
          };
        }
      }
      
      throw new Error("No data returned");
    } catch (error) {
      console.error("Error creating budget:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, budgetData) {
    try {
      const client = getApperClient();
      const params = {
        records: [{
          Id: id,
          Name_c: `${budgetData.category} Budget`,
          Category_c: budgetData.category,
          Monthly_Limit_c: budgetData.monthlyLimit,
          Month_c: budgetData.month,
          Year_c: budgetData.year
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
          throw new Error("Failed to update budget");
        }
        
        if (successful.length > 0) {
          const item = successful[0].data;
          return {
            Id: item.Id,
            category: item.Category_c,
            monthlyLimit: item.Monthly_Limit_c,
            month: item.Month_c,
            year: item.Year_c
          };
        }
      }
      
      throw new Error("No data returned");
    } catch (error) {
      console.error("Error updating budget:", error?.response?.data?.message || error);
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
          throw new Error("Failed to delete budget");
        }
        
        return successful.length > 0;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting budget:", error?.response?.data?.message || error);
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
          {"field": {"Name": "Category_c"}},
          {"field": {"Name": "Monthly_Limit_c"}},
          {"field": {"Name": "Month_c"}},
          {"field": {"Name": "Year_c"}}
        ],
        where: [
          {"FieldName": "Month_c", "Operator": "EqualTo", "Values": [monthYear]}
        ]
      };
      
      const response = await client.fetchRecords(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data.map(item => ({
        Id: item.Id,
        category: item.Category_c,
        monthlyLimit: item.Monthly_Limit_c,
        month: item.Month_c,
        year: item.Year_c
      }));
    } catch (error) {
      console.error("Error fetching budgets by month:", error?.response?.data?.message || error);
      return [];
    }
  },

  async upsertBudget(category, monthlyLimit, month, year) {
    try {
      const client = getApperClient();
      
      // First check if budget exists
      const existingParams = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name_c"}},
          {"field": {"Name": "Category_c"}},
          {"field": {"Name": "Monthly_Limit_c"}},
          {"field": {"Name": "Month_c"}},
          {"field": {"Name": "Year_c"}}
        ],
        where: [
          {"FieldName": "Category_c", "Operator": "EqualTo", "Values": [category]},
          {"FieldName": "Month_c", "Operator": "EqualTo", "Values": [month]},
          {"FieldName": "Year_c", "Operator": "EqualTo", "Values": [year.toString()]}
        ]
      };
      
      const existingResponse = await client.fetchRecords(TABLE_NAME, existingParams);
      
      if (!existingResponse.success) {
        console.error(existingResponse.message);
        throw new Error(existingResponse.message);
      }
      
      if (existingResponse.data && existingResponse.data.length > 0) {
        // Update existing budget
        const existingBudget = existingResponse.data[0];
        return await this.update(existingBudget.Id, {
          category,
          monthlyLimit,
          month,
          year
        });
      } else {
        // Create new budget
        return await this.create({
          category,
          monthlyLimit,
          month,
          year
        });
      }
    } catch (error) {
      console.error("Error upserting budget:", error?.response?.data?.message || error);
      throw error;
    }
  }
};