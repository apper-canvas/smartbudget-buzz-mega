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

const TABLE_NAME = 'savings_goal_c';

export const savingsGoalService = {
  async getAll() {
    try {
      const client = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name_c"}},
          {"field": {"Name": "Title_c"}},
          {"field": {"Name": "Target_Amount_c"}},
          {"field": {"Name": "Current_Amount_c"}},
          {"field": {"Name": "Deadline_c"}}
        ],
        orderBy: [{"fieldName": "Deadline_c", "sorttype": "ASC"}]
      };
      
      const response = await client.fetchRecords(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data.map(item => ({
        Id: item.Id,
        title: item.Title_c,
        targetAmount: item.Target_Amount_c,
        currentAmount: item.Current_Amount_c,
        deadline: item.Deadline_c
      }));
    } catch (error) {
      console.error("Error fetching savings goals:", error?.response?.data?.message || error);
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
          {"field": {"Name": "Title_c"}},
          {"field": {"Name": "Target_Amount_c"}},
          {"field": {"Name": "Current_Amount_c"}},
          {"field": {"Name": "Deadline_c"}}
        ]
      };
      
      const response = await client.getRecordById(TABLE_NAME, id, params);
      
      if (!response?.data) {
        return null;
      }
      
      const item = response.data;
      return {
        Id: item.Id,
        title: item.Title_c,
        targetAmount: item.Target_Amount_c,
        currentAmount: item.Current_Amount_c,
        deadline: item.Deadline_c
      };
    } catch (error) {
      console.error(`Error fetching savings goal ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(goalData) {
    try {
      const client = getApperClient();
      const params = {
        records: [{
          Name_c: goalData.title,
          Title_c: goalData.title,
          Target_Amount_c: goalData.targetAmount,
          Current_Amount_c: goalData.currentAmount || 0,
          Deadline_c: goalData.deadline
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
          throw new Error("Failed to create savings goal");
        }
        
        if (successful.length > 0) {
          const item = successful[0].data;
          return {
            Id: item.Id,
            title: item.Title_c,
            targetAmount: item.Target_Amount_c,
            currentAmount: item.Current_Amount_c,
            deadline: item.Deadline_c
          };
        }
      }
      
      throw new Error("No data returned");
    } catch (error) {
      console.error("Error creating savings goal:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, goalData) {
    try {
      const client = getApperClient();
      const params = {
        records: [{
          Id: id,
          Name_c: goalData.title,
          Title_c: goalData.title,
          Target_Amount_c: goalData.targetAmount,
          Current_Amount_c: goalData.currentAmount,
          Deadline_c: goalData.deadline
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
          throw new Error("Failed to update savings goal");
        }
        
        if (successful.length > 0) {
          const item = successful[0].data;
          return {
            Id: item.Id,
            title: item.Title_c,
            targetAmount: item.Target_Amount_c,
            currentAmount: item.Current_Amount_c,
            deadline: item.Deadline_c
          };
        }
      }
      
      throw new Error("No data returned");
    } catch (error) {
      console.error("Error updating savings goal:", error?.response?.data?.message || error);
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
          throw new Error("Failed to delete savings goal");
        }
        
        return successful.length > 0;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting savings goal:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async updateAmount(id, amount) {
    try {
      // First get the current goal
      const currentGoal = await this.getById(id);
      if (!currentGoal) {
        throw new Error("Savings goal not found");
      }
      
      // Calculate new amount
      const newCurrentAmount = Math.max(0, currentGoal.currentAmount + amount);
      
      // Update with new amount
      const client = getApperClient();
      const params = {
        records: [{
          Id: id,
          Current_Amount_c: newCurrentAmount
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
          throw new Error("Failed to update savings goal amount");
        }
        
        if (successful.length > 0) {
          const item = successful[0].data;
          return {
            Id: item.Id,
            title: item.Title_c,
            targetAmount: item.Target_Amount_c,
            currentAmount: item.Current_Amount_c,
            deadline: item.Deadline_c
          };
        }
      }
      
      throw new Error("No data returned");
    } catch (error) {
      console.error("Error updating savings goal amount:", error?.response?.data?.message || error);
      throw error;
    }
  }
};