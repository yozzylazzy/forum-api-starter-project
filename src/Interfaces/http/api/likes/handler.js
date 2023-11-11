const AddCancelLikeUseCase = require('../../../../Applications/use_case/AddCancelLikeUseCase');

class LikesHandler {
  constructor(container) {
    this._container = container;
    this.addCancelLikeHandler = this.addCancelLikeHandler.bind(this);
  }

  async addCancelLikeHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { commentId, threadId } = request.params;
    const addCancelLikeUseCase = this._container.getInstance(AddCancelLikeUseCase.name);
    await addCancelLikeUseCase.execute({
      owner, commentId, threadId,
    });
    const response = h.response({ status: 'success' });
    response.code(200);
    return response;
  }
}

module.exports = LikesHandler;
