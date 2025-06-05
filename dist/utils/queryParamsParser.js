"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SortDirection = exports.parseQueryParams = void 0;
const parseQueryParams = (req) => {
    const parsedPageNumber = parseInt(req.query.pageNumber) || 1;
    const parsedPageSize = parseInt(req.query.pageSize) || 10;
    const sortBy = req.query.sortBy || 'createdAt';
    // const sortBy: SortBy = req.query.sortBy as SortBy || SortBy.CreatedAt;
    const sortDirection = req.query.sortDirection === 'asc' ? SortDirection.Asc : SortDirection.Desc;
    return {
        parsedPageNumber,
        parsedPageSize,
        sortBy,
        sortDirection,
    };
};
exports.parseQueryParams = parseQueryParams;
var SortDirection;
(function (SortDirection) {
    SortDirection["Asc"] = "asc";
    SortDirection["Desc"] = "desc";
})(SortDirection || (exports.SortDirection = SortDirection = {}));
// enum SortBy {
//     Name = 'name',
//     CreatedAt = 'createdAt'
// }
