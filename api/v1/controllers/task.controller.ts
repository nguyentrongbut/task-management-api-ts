import {Request, Response} from "express";
import Task from "../models/tasks.model";
import paginationHelper from "../../../helpers/pagination";
import searchHelper from "../../../helpers/search";

export const index =  async (req: Request, res: Response) => {
    interface Find {
        deleted: boolean;
        status?: string;
        title?: RegExp;
    }
    // Find
    const find:Find = {
        deleted: false,
    }

    if (req.query.status) {
        find.status = req.query.status.toString();
    }
    // End find

    // Search
    let objectSearch = searchHelper(req.query);

    if (req.query.keyword) {
        find.title = objectSearch.regex
    }
    // End Search

    // Sort
    const sort = {}

    if (req.query.sortKey && req.query.sortValue) {
        const sortKey = req.query.sortKey.toLocaleString();
        sort[sortKey] = req.query.sortValue;
    }
    // End Sort

    // Pagination
    let initPagination = {
        currentPage: 1,
        limitItems: 3,
    }
    const countTasks = await Task.countDocuments(find);
    const objectPagination = paginationHelper(
        initPagination,
        req.query,
        countTasks
    )
    // End Pagination

    const tasks = await Task
        .find(find)
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip)
    ;
    res.json(tasks);
}

export const detail = async (req: Request, res: Response) => {
    const id:string = req.params.id;
    const task = await Task.findOne({
        _id: id,
        deleted: false
    });
    res.json(task);
}