import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="p-4 text-center">
      <div className="flex flex-col justify-center items-center space-y-2 text-sm text-gray-500 dark:text-gray-400">
        <Link to="/about" className="hover:text-gray-700 dark:hover:text-gray-200">
          About
        </Link>
      </div>
    </footer>
  );
};