import { SearchX } from 'lucide-react';

const EmptyState = ({ title = 'No results found', message = 'Try adjusting your search or filters to find what you are looking for.' }) => {
  return (
    <div className="text-center p-5">
      <div className="d-inline-flex align-items-center justify-content-center bg-light rounded-circle p-4 mb-4">
        <SearchX size={48} className="text-secondary" />
      </div>
      <h3 className="h5 fw-semibold text-dark mb-2">{title}</h3>
      <p className="text-secondary mb-0">{message}</p>
    </div>
  );
};

export default EmptyState;
