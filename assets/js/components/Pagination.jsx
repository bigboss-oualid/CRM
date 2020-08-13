import React from 'react';

const Pagination = ({currentPage, itemsPerPage, length, onPageChanged}) => {

    const pagesCount = Math.ceil(length / itemsPerPage);

    const getRange = (start, end) => {
        return Array(end - start + 1)
            .fill(this)// or fill()
            .map((v, i) => i + start);
    };

    const paginate = (currentPage, pagesCount) => {
        let delta;
        if (length <= 7) {
            // delta === 7: [1 2 3 4 5 6 7]
            delta = 7;
        } else {
            // delta === 2: [1 ... 4 5 6 ... 10]
            // delta === 4: [1 2 3 4 5 ... 10]
            delta = currentPage > 4 && currentPage < pagesCount - 3 ? 2 : 4;
        }

        const range = {
            start: Math.round(currentPage - delta / 2),
            end: Math.round(currentPage + delta / 2)
        };

        if (range.start - 1 === 1 || range.end + 1 === pagesCount) {
            range.start += 1;
            range.end += 1;
        }

        let pages =
            currentPage > delta
                ? getRange(Math.min(range.start, pagesCount - delta), Math.min(range.end, pagesCount))
                : getRange(1, Math.min(pagesCount, delta + 1));

        const withDots = (value, pair) => (pages.length + 1 !== pagesCount ? pair : [value]);

        if (currentPage > 4 && length > 7) {
            pages = withDots(1, [1, '...']).concat(pages);
        }

        if (pages[pages.length - 1] < pagesCount) {
            pages = pages.concat(withDots(pagesCount, ['...', pagesCount]));
        }

        return pages;
    };

    return (
        <div className="pt-3">
            <ul className="d-flex justify-content-center pagination pagination-sm">
                <li className={"page-item" + (currentPage === 1 && " disabled")}>
                    <button
                        className="page-link"
                        onClick={() => onPageChanged(currentPage - 1)}
                    >
                        <i className="fas fa-backward"></i>
                    </button>
                </li>
                {paginate(currentPage, pagesCount).map((page, key) =>
                    <li key={key}
                        className={"page-item " + (currentPage === page && " active ") + (page === '...' && " disabled")}>
                        <button
                            className="page-link"
                            onClick={() => onPageChanged(page)}
                        >
                            {page}
                        </button>
                    </li>)}

                <li className={"page-item" + (currentPage === pagesCount && " disabled")}>
                    <button
                        className="page-link"
                        onClick={() => onPageChanged(currentPage + 1)}
                    >
                        <i className="fas fa-forward"></i>
                    </button>
                </li>
            </ul>
        </div>
    );
};
Pagination.getPaginatedData = (paginatedItems, currentPage, itemsPerPage) => {
    //    30    =     4       *    10        -     10
    const start = currentPage * itemsPerPage - itemsPerPage;
    //Slice our paginated items list to pages
    return paginatedItems.slice(start, start + itemsPerPage);
};
export default Pagination;