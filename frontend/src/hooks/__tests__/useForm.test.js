import { renderHook, act } from '@testing-library/react';
import useForm from '../useForm';

test('sets initial values and updates on change', () => {
  const { result } = renderHook(() => useForm({ name: '' }));
  expect(result.current.values.name).toBe('');
  act(() => {
    result.current.handleChange('name', 'Test User');
  });
  expect(result.current.values.name).toBe('Test User');
});
