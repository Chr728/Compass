import { renderHook } from '@testing-library/react-hooks';
import { useAuth } from '../AuthContext';
import { createUser } from '@/app/http/createUser';

jest.mock('@/app/http/createUser');

describe('createUser', () => {
  it('should return a successful response', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAuth());
    expect(result.current.error).toBeNull();

    const data = { email: 'john.doe@example.com', password: 'password' };
    createUser.mockResolvedValueOnce({ success: true });

    result.current.signUp(data);
    await waitForNextUpdate();
    expect(result.current.error).toBeNull();
  });

  it('should return an error response', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAuth());
    expect(result.current.error).toBeNull();

    const data = { email: 'john.doe@example.com', password: 'password' };
    const error = { message: 'Internal server error' };
    createUser.mockRejectedValueOnce(error);

    result.current.signUp(data);
    await waitForNextUpdate();
    expect(result.current.error).toEqual(error.message);
  });
});