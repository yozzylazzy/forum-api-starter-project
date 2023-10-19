const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this, this.getThreadHandler = this.getThreadHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const { id: owner } = request.auth.credentials;
    const addedThread = await addThreadUseCase.execute({ ...request.payload, owner });
    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }
  async getThreadHandler(request, h) {
    const { threadId } = request.params;
    const showThreadUseCase = this._container.getInstance(ShowThreadUseCase.name);
    const showThread = await showThreadUseCase.execute(threadId);
    const response = h.response({
      status: 'success',
      data: { thread: shownThread },
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
