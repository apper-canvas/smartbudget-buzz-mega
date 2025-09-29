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

const TABLE_NAME = 'category_c';

export const categoryService = {
  async getAll() {
    try {
      const client = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name_c"}},
          {"field": {"Name": "Type_c"}},
          {"field": {"Name": "Is_Custom_c"}}
        ]
      };
      
      const response = await client.fetchRecords(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data.map(item => ({
        Id: item.Id,
        name: item.Name_c,
        type: item.Type_c,
        isCustom: item.Is_Custom_c
      }));
    } catch (error) {
      console.error("Error fetching categories:", error?.response?.data?.message || error);
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
          {"field": {"Name": "Type_c"}},
          {"field": {"Name": "Is_Custom_c"}}
        ]
      };
      
      const response = await client.getRecordById(TABLE_NAME, id, params);
      
      if (!response?.data) {
        return null;
      }
      
      const item = response.data;
      return {
        Id: item.Id,
        name: item.Name_c,
        type: item.Type_c,
        isCustom: item.Is_Custom_c
      };
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(categoryData) {
    try {
      const client = getApperClient();
      const params = {
        records: [{
          Name_c: categoryData.name,
          Type_c: categoryData.type,
          Is_Custom_c: true
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
          throw new Error("Failed to create category");
        }
        
        if (successful.length > 0) {
          const item = successful[0].data;
          return {
            Id: item.Id,
            name: item.Name_c,
            type: item.Type_c,
            isCustom: item.Is_Custom_c
          };
        }
      }
      
      throw new Error("No data returned");
    } catch (error) {
      console.error("Error creating category:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, categoryData) {
    try {
      const client = getApperClient();
      const params = {
        records: [{
          Id: id,
          Name_c: categoryData.name,
          Type_c: categoryData.type,
          Is_Custom_c: categoryData.isCustom
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
          throw new Error("Failed to update category");
        }
        
        if (successful.length > 0) {
          const item = successful[0].data;
          return {
            Id: item.Id,
            name: item.Name_c,
            type: item.Type_c,
            isCustom: item.Is_Custom_c
          };
        }
      }
      
      throw new Error("No data returned");
    } catch (error) {
      console.error("Error updating category:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      // First check if category is custom
      const category = await this.getById(id);
      if (!category || !category.isCustom) {
        throw new Error("Cannot delete non-custom category");
      }
      
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
          throw new Error("Failed to delete category");
        }
        
        return successful.length > 0;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting category:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async getByType(type) {
    try {
      const client = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name_c"}},
          {"field": {"Name": "Type_c"}},
          {"field": {"Name": "Is_Custom_c"}}
        ],
        where: [
          {"FieldName": "Type_c", "Operator": "EqualTo", "Values": [type]}
        ]
      };
      
      const response = await client.fetchRecords(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data.map(item => ({
        Id: item.Id,
        name: item.Name_c,
        type: item.Type_c,
        isCustom: item.Is_Custom_c
      }));
    } catch (error) {
      console.error("Error fetching categories by type:", error?.response?.data?.message || error);
      return [];
    }
}
};