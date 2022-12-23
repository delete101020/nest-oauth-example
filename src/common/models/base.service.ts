import { Document, Model } from 'mongoose';

export class BaseService<T extends Document> {
  private readonly _model: Model<T>;
  private _populateOnFind: string[] = [];

  constructor(model: Model<T>, populateOnFind: string[] = []) {
    this._model = model;
    this._populateOnFind = populateOnFind;
  }

  async get(condition = {}, projection = null, options = {}): Promise<T[]> {
    return this._model
      .find(condition, projection, options)
      .populate(this._populateOnFind)
      .exec();
  }

  async count(condition = {}): Promise<number> {
    return this._model.countDocuments(condition).exec();
  }

  async getOne(value: any, queryBy = '_id') {
    const query = {};
    query[queryBy] = value;

    return this._model.findOne(query).populate(this._populateOnFind).exec();
  }

  async getOneBy(condition = {}) {
    return this._model.findOne(condition).populate(this._populateOnFind).exec();
  }

  async createFromRequestBody(body: Partial<T>): Promise<T> {
    return this._model.create({ ...body });
  }

  async create(resource: T): Promise<T> {
    return this._model.create(resource);
  }

  async updateFromRequestBody(body: Partial<T>): Promise<T> {
    const existed: T = await this._model
      .findById(body._id ? body._id : body.id)
      .exec();

    const updated = { _id: existed._id, ...body };

    return this._model
      .findByIdAndUpdate(updated._id, updated, { new: true })
      .exec();
  }

  async update(updateResource: any) {
    return this._model
      .findByIdAndUpdate(updateResource._id, updateResource, { new: true })
      .exec();
  }

  async delete(condition = {}) {
    return this._model.deleteMany(condition).exec();
  }

  async deleteOne(id: string): Promise<T> {
    return this._model.findByIdAndDelete(id).exec();
  }
}
