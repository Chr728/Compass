import '../weightJournalAPI';

//test the getWeightJournals function

//test the getWeightJournal function
describe('getWeightJournal', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should get a user by ID', async () => {
    const mockUser = { id: 1, name: 'John Doe', email: 'johndoe@example.com' };
    const mockResponse = { data: mockUser };
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });
    global.fetch.mockImplementation(mockFetch);

    const userData = await getWeightJournal(mockUser.id);

    expect(userData.data.id).toEqual(mockUser.id);
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:8000/api/journals/weight/' + mockUser.id,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'GET',
      }
    );
  });

  it('should throw an error if the request fails', async () => {
    const mockUserId = 1;
    const mockFetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });
    global.fetch.mockImplementation(mockFetch);

    await expect(getWeightJournal(mockUserId)).rejects.toThrow(
      'Error creating weight journal entry:'
    );
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:8000/api/journals/weight/' + mockUserId,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'GET',
      }
    );
  });
});

//test the addWeightJournal function

//test the updateWeightJournal function

//test the deleteWeightJournal function
