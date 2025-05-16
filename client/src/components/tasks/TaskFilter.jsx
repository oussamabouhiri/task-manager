import React from 'react';
import { Search, Filter } from 'lucide-react';
import Select from '../common/Select';

const TaskFilter = ({ filters, setFilters, onFilterChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
  };

  const handleSearchChange = (e) => {
    const { value } = e.target;
    setFilters((prev) => ({ ...prev, search: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange(filters);
  };

  const handleClear = () => {
    const clearedFilters = {
      status: '',
      search: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search input */}
        <div className="md:col-span-2">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              name="search"
              id="search"
              value={filters.search}
              onChange={handleSearchChange}
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
              placeholder="Search tasks by title or description"
            />
          </div>
        </div>

        {/* Status filter */}
        <div>
          <Select
            id="status"
            name="status"
            label="Status"
            value={filters.status}
            onChange={handleChange}
            options={[
              { value: '', label: 'All Statuses' },
              { value: 'pending', label: 'Pending' },
              { value: 'in progress', label: 'In Progress' },
              { value: 'completed', label: 'Completed' },
            ]}
          />
        </div>

        {/* Sort options */}
        <div>
          <Select
            id="sortBy"
            name="sortBy"
            label="Sort By"
            value={filters.sortBy}
            onChange={handleChange}
            options={[
              { value: 'createdAt', label: 'Creation Date' },
              { value: 'deadline', label: 'Deadline' },
              { value: 'priority', label: 'Priority' },
              { value: 'title', label: 'Title' },
            ]}
          />
        </div>

        <div>
          <Select
            id="sortOrder"
            name="sortOrder"
            label="Order"
            value={filters.sortOrder}
            onChange={handleChange}
            options={[
              { value: 'asc', label: 'Ascending' },
              { value: 'desc', label: 'Descending' },
            ]}
          />
        </div>
        
        {/* Action buttons */}
        <div className="md:col-span-4 flex justify-end space-x-2 mt-2">
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Clear Filters
          </button>
          <button
            type="submit"
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Filter className="h-4 w-4 mr-1" />
            Apply Filters
          </button>
        </div>
      </div>
    </form>
  );
};

export default TaskFilter;