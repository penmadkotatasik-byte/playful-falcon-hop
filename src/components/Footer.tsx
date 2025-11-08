import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="p-4 text-center">
      <div className="flex justify-center items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
        <Link to="/about" className="hover:text-gray-700 dark:hover:text-gray-200">
          About
        </Link>
        <span>|</span>
        <a
          href="https://www.dyad.sh/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-700 dark:hover:text-gray-200"
        >
          Made with Dyad
        </a>
      </div>
    </footer>
  );
};