const { Schema, Model, model } = require('mongoose')

const schema = new Schema({
    images: Array,
    text: String,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    isRead: Boolean
});

class ModelClass extends Model {
    static async findAndReplaceUserInfo({
        index = 0,
        pageSize = 20
    }) {
        const totalCount = await this.collection.count();
        if (totalCount == index) {
            return []
        }
        return this.find({})
            .skip(totalCount - pageSize - index > 0 ? totalCount - pageSize - index : 0)
            .limit(totalCount - pageSize - index < 0 ? totalCount - index : Number(pageSize))
            .populate('user')

    }
}

schema.loadClass(ModelClass);

module.exports = model('Message', schema);
