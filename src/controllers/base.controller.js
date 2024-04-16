function BaseController() {
  this.pagination = async (model, query, page, limit) => {
    try {
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10;

      const startIndex = (page - 1) * limit;

      const totalCount = await model.countDocuments(query);

      const results = await model.find(query).skip(startIndex).limit(limit);

      const totalPages = Math.ceil(totalCount / limit);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      return {
        results: results,
        pagination: {
          total: totalCount,
          totalPages: totalPages,
          currentPage: page,
          hasNextPage: hasNextPage,
          hasPreviousPage: hasPreviousPage,
        },
      };
    } catch (error) {
      throw new Error(error.message);
    }
  };

  this.appendFilters = (query, filters) => {
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== null && filters[key] !== undefined) {
        query[key] = filters[key];
      }
    });
    return query;
  };

  return this;
}

module.exports = new BaseController();
