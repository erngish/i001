import { useAppState } from '@/store/app-context';
import './ToastContainer.css';

export function ToastContainer() {
  const { state, dispatch } = useAppState();

  return (
    <div className="toast-container">
      {state.toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          <div className="toast-content">
            <span className="toast-title">{toast.title}</span>
            {toast.description && (
              <span className="toast-desc">{toast.description}</span>
            )}
          </div>
          <button
            className="toast-close"
            onClick={() => dispatch({ type: 'REMOVE_TOAST', payload: toast.id })}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
