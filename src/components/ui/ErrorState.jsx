import { AlertTriangle } from 'lucide-react';

const ErrorState = ({ message = 'Something went wrong', onRetry }) => {
  return (
    <div className="text-center p-5">
      <div className="d-inline-flex align-items-center justify-content-center bg-danger bg-opacity-10 rounded-circle p-4 mb-4">
        <AlertTriangle size={48} className="text-danger" />
      </div>
      <h3 className="h5 fw-semibold text-dark mb-2">Error Loading Data</h3>
      <p className="text-secondary mb-4">{message}</p>
      {onRetry && (
        <button className="btn btn-outline-primary px-4" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;
