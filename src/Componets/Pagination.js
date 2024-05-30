// import React from 'react';

// const Pagination = ({ currentPage, totalPages, onPageChange }) => {
//   const pageNumbers = [];

//   for (let i = 1; i <= totalPages; i++) {
//     pageNumbers.push(i);
//   }

//   // Limit the page numbers to a range (e.g., 1 to 10)
//   const displayPageNumbers = pageNumbers.slice(0, 10);

//   return (
//     <nav className="flex justify-center mt-8">
//       <ul className="flex space-x-2">
//         <li className={`page-item ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}>
//           <button
//             onClick={() => onPageChange(currentPage - 1)}
//             className="px-2 py-1 border rounded-md bg-[#3a0843] text-white"
//             disabled={currentPage === 1}
//           >
//             Previous
//           </button>
//         </li>
//         {displayPageNumbers.map((number) => (
//           <li
//             key={number}
//             className={`page-item ${currentPage === number ? 'bg-blue-500 text-white border rounded-md' : 'bg-white text-black border rounded-md'}`}
//           >
//             <button
//               onClick={() => onPageChange(number)}
//               className={`px-2 py-1 border rounded-md ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
//             >
//               {number}
//             </button>
//           </li>
//         ))}
//         <li className={`page-item ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}>
//           <button
//             onClick={() => onPageChange(currentPage + 1)}
//             className="px-2 py-1 border rounded-md bg-[#3a0843] text-white transition-colors duration-200"
//             disabled={currentPage === totalPages}
//           >
//             Next
//           </button>
//         </li>
//       </ul>
//     </nav>
//   );
// };

// export default Pagination;
import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Calculate the batch start and end page numbers
  const batchSize = 10;
  const batchStart = Math.floor((currentPage - 1) / batchSize) * batchSize + 1;
  const batchEnd = Math.min(batchStart + batchSize - 1, totalPages);

  const displayPageNumbers = pageNumbers.slice(batchStart - 1, batchEnd);

  return (
    <nav className="flex justify-center mt-8">
      <ul className="flex space-x-2">
        <li className={`page-item ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            className="px-2 py-1 border rounded-md bg-[#3a0843] text-white"
            disabled={currentPage === 1}
          >
            Previous
          </button>
        </li>
        {displayPageNumbers.map((number) => (
          <li
            key={number}
            className={`page-item ${currentPage === number ? 'bg-blue-500 text-white border rounded-md' : 'bg-white text-black border rounded-md'}`}
          >
            <button
              onClick={() => onPageChange(number)}
              className={`px-2 py-1 border rounded-md ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
            >
              {number}
            </button>
          </li>
        ))}
        <li className={`page-item ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            className="px-2 py-1 border rounded-md bg-[#3a0843] text-white transition-colors duration-200"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
