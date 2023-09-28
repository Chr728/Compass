import { renderHook } from '@testing-library/react-hooks';
import { useUser } from '../UserContext';

jest.mock('@/app/http/getUser');
jest.mock('@/app/http/updateUser');

describe('getUser', () => {
  it('should return a successful response', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useUser());
    expect(result.current.userInfo).toBeNull();

    result.current.updateCurrentUser({ firstName: 'John', lastName: 'Doe' });
    await waitForNextUpdate();
    expect(result.current.userInfo).toEqual({
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      // ... other user attributes
    });
  });

  it('should return an error response', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useUser());
    expect(result.current.userInfo).toBeNull();

    result.current.updateCurrentUser({ firstName: 'John', lastName: 'Doe' });
    await waitForNextUpdate();
    expect(result.current.userInfo).toBeNull();
  });
});

describe('updateUser', () => {
  it('should return a successful response', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useUser());
    expect(result.current.userInfo).toBeNull();

    result.current.updateCurrentUser({ firstName: 'John', lastName: 'Doe' });
    await waitForNextUpdate();
    expect(result.current.userInfo).toEqual({
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      // ... other user attributes
    });
  });

  it('should return an error response', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useUser());
    expect(result.current.userInfo).toBeNull();

    result.current.updateCurrentUser({ firstName: 'John', lastName: 'Doe' });
    await waitForNextUpdate();
    expect(result.current.userInfo).toBeNull();
  });
});