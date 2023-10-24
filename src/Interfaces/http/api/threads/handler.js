const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const ShowThreadUseCase = require('../../../../Applications/use_case/ShowThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadByIdHandler = this.getThreadByIdHandler.bind(this);
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

  async getThreadByIdHandler(request, h) {
    const showThreadUseCase = this._container.getInstance(ShowThreadUseCase.name);
    const { threadId } = request.params;
    const showThread = await showThreadUseCase.execute(threadId);
    const response = h.response({
      status: 'success',
      data: {
        thread: showThread,
      },
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
