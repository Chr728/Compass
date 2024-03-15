import { auth } from '../../config/firebase';
import fetchLocations from '../fetchLocations';
import {getFoodIntakeJournals} from "../foodJournalAPI";

describe('getFoodIntakeJournals', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should fetch locations for the user', async () => {
        const mockLatitude = 45.6;
        const mockLongitude = -73.63;
        const mockType = 'hospital';
        const mockUserId = '123';
        const mockToken = 'mockToken';
        const mockCurrentUser = {
            uid: mockUserId,
            getIdToken: jest.fn().mockResolvedValue(mockToken),
        };

        Object.defineProperty(auth, 'currentUser', {
            get: jest.fn().mockReturnValue(mockCurrentUser),
        });

        const mockResponse = {
            ok: true,
            json: jest.fn().mockResolvedValue({}),
        };
        const mockFetch = jest.fn().mockResolvedValue(mockResponse);
        global.fetch = mockFetch;

        const result = await fetchLocations(mockLatitude, mockLongitude, mockType);

        expect(mockFetch).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}/api/locations?latitude=${mockLatitude}&longitude=${mockLongitude}&type=${mockType}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${mockToken}`,
            },
        });
        expect(mockResponse.json).toHaveBeenCalled();
        expect(result).toEqual({});
    });

    it('should throw an error if the any of the parameters are not defined', async () => {
        Object.defineProperty(auth, 'currentUser', {
            get: jest.fn().mockReturnValue(null),
        });

        const mockResponse = {
            ok: true,
            json: jest.fn().mockResolvedValue({}),
        };
        const mockFetch = jest.fn().mockResolvedValue(mockResponse);
        global.fetch = mockFetch;

        await expect(getFoodIntakeJournals()).rejects.toThrow('No user is currently signed in.');
    });

    it('should throw an error if the fetch request fails', async () => {
        const mockUserId = '123';
        const mockToken = 'mockToken';
        const mockCurrentUser = {
            uid: mockUserId,
            getIdToken: jest.fn().mockResolvedValue(mockToken),
        };

        Object.defineProperty(auth, 'currentUser', {
            get: jest.fn().mockReturnValue(mockCurrentUser),
        });

        const mockErrorResponse = {
            ok: false,
        };
        const mockErrorFetch = jest.fn().mockResolvedValue(mockErrorResponse);
        global.fetch = mockErrorFetch;

        await expect(fetchLocations()).rejects.toThrow('Error fetching locations');
    });

    it('should throw an error if the user is not signed in', async () => {
        Object.defineProperty(auth, 'currentUser', {
            get: jest.fn().mockReturnValue(null),
        });

        const mockResponse = {
            ok: true,
            json: jest.fn().mockResolvedValue({}),
        };
        const mockFetch = jest.fn().mockResolvedValue(mockResponse);
        global.fetch = mockFetch;

        await expect(fetchLocations()).rejects.toThrow('Error fetching locations');
    });
});
