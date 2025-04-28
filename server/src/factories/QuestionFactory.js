class QuestionFactory {
    static create(type, opts) {
        switch (type) {
            case 'multipleChoice': return { type, options: opts.options };
            case 'trueFalse': return { type, answer: opts.answer };
            default: throw new Error('Unknown type');
        }
    }
}
module.exports = QuestionFactory;