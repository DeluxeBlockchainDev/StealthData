import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

const LEFT_PAGE = "LEFT";
const RIGHT_PAGE = "RIGHT";

const range = (from, to, step = 1) => {
    let i = from;
    const range = [];

    while (i <= to) {
        range.push(i);
        i += step;
    }

    return range;
};

class CtmPagination extends Component {
    constructor(props) {
        super(props);
        const { totalRecords = null, pageLimit = 30, pageNeighbours = 0 } = props;

        this.pageLimit = typeof pageLimit === "number" ? pageLimit : 30;
        this.totalRecords = typeof totalRecords === "number" ? totalRecords : 0;

        this.pageNeighbours =
            typeof pageNeighbours === "number"
                ? Math.max(0, Math.min(pageNeighbours, 2))
                : 0;

        this.totalPages = Math.ceil(this.totalRecords / this.pageLimit);

        this.state = { currentPage: 1, totalRecords: totalRecords };
    }

    componentDidMount() {
      //  this.gotoPage(1);
        //this.showingRecords();
    }
    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.totalRecords !== prevProps.totalRecords) {
            const { totalRecords = null, pageLimit = 30, pageNeighbours = 0 } = this.props;
            this.totalRecords = typeof totalRecords === "number" ? totalRecords : 0;
            this.pageLimit = typeof pageLimit === "number" ? pageLimit : 30;

            this.totalPages = Math.ceil(this.totalRecords / this.pageLimit);
            this.setState({ totalRecords: totalRecords, currentPage: pageNeighbours })
        }

    }
    gotoPage = page => {
        const { onPageChanged = f => f } = this.props;

        const currentPage = Math.max(0, Math.min(page, this.totalPages));
        const paginationData = {
            currentPage,
            totalPages: this.totalPages,
            pageLimit: this.pageLimit,
            totalRecords: this.totalRecords
        };

        this.setState({ currentPage }, () => onPageChanged(paginationData));
    };

    onSizeChange = event => {
        const { onPageChanged = f => f } = this.props;
        window.scrollTo(0, 0)
        this.pageLimit = event.target.value;
        const paginationData = {
            currentPage: 1,
            totalPages: this.totalPages,
            pageLimit: this.pageLimit,
            totalRecords: this.totalRecords
        };

        this.setState({ currentPage: 1 }, () => onPageChanged(paginationData));
    };

    handleClick = (page, evt) => {
        evt.preventDefault();
        this.gotoPage(page);
    };

    handleMoveLeft = evt => {
        evt.preventDefault();
        this.gotoPage(this.state.currentPage - this.pageNeighbours * 2 - 1);
    };

    handleMoveRight = evt => {
        evt.preventDefault();
        this.gotoPage(this.state.currentPage + this.pageNeighbours * 2 + 1);
    };

    fetchPageNumbers = () => {
        const totalPages = this.totalPages;
        const currentPage = this.state.currentPage;
        const pageNeighbours = this.pageNeighbours;

        const totalNumbers = this.pageNeighbours * 2 + 3;
        const totalBlocks = totalNumbers + 2;

        if (totalPages > totalBlocks) {
            let pages = [];

            const leftBound = currentPage - pageNeighbours;
            const rightBound = currentPage + pageNeighbours;
            const beforeLastPage = totalPages - 1;

            const startPage = leftBound > 2 ? leftBound : 2;
            const endPage = rightBound < beforeLastPage ? rightBound : beforeLastPage;

            pages = range(startPage, endPage);

            const pagesCount = pages.length;
            const singleSpillOffset = totalNumbers - pagesCount - 1;

            const leftSpill = startPage > 2;
            const rightSpill = endPage < beforeLastPage;

            const leftSpillPage = LEFT_PAGE;
            const rightSpillPage = RIGHT_PAGE;

            if (leftSpill && !rightSpill) {
                const extraPages = range(startPage - singleSpillOffset, startPage - 1);
                pages = [leftSpillPage, ...extraPages, ...pages];
            } else if (!leftSpill && rightSpill) {
                const extraPages = range(endPage + 1, endPage + singleSpillOffset);
                pages = [...pages, ...extraPages, rightSpillPage];
            } else if (leftSpill && rightSpill) {
                pages = [leftSpillPage, ...pages, rightSpillPage];
            }

            return [1, ...pages, totalPages];
        }

        return range(1, totalPages);
    };
    showingRecords = () => {
        const { currentPage } = this.state;
        //if(currentPage > 0){
            let from = ((currentPage - 1) * this.pageLimit) + 1;
            let to = (currentPage * this.pageLimit);
            let text = `Showing rows ${from} to ${to} of ${this.state.totalRecords}`
            return text;
        // }else{
        //     return '';
        // }
        
    }
    render() {
        //if (!this.totalRecords) return null;

        //if (this.totalPages === 1) return null;

        const { currentPage } = this.state;
        const pages = this.fetchPageNumbers();
        const style = {
            width: "75px"
        };

        
        return (
            <Fragment>
                <div className="d-flex justify-content-between align-items-center flex-wrap">
                    <div className="d-flex flex-wrap py-2 mr-3 ">
                        <nav aria-label="Countries Pagination">
                            <ul className="pagination">
                                {pages.map((page, index) => {
                                    if (page === LEFT_PAGE)
                                        return (
                                            <li key={index} className="page-item">
                                                <a
                                                    href="#!"
                                                    className="page-link"
                                                    aria-label="Previous"
                                                    onClick={this.handleMoveLeft}
                                                >
                                                    <span aria-hidden="true">&laquo;</span>
                                                    <span className="sr-only">Previous</span>
                                                </a>
                                            </li>
                                        );

                                    if (page === RIGHT_PAGE)
                                        return (
                                            <li key={index} className="page-item">
                                                <a
                                                    href="#!"
                                                    className="page-link"
                                                    aria-label="Next"
                                                    onClick={this.handleMoveRight}
                                                >
                                                    <span aria-hidden="true">&raquo;</span>
                                                    <span className="sr-only">Next</span>
                                                </a>
                                            </li>
                                        );

                                    return (
                                        <li
                                            key={index}
                                            className={`page-item${currentPage === page ? " active" : ""
                                                }`}
                                        >
                                            <a
                                                href="#!"
                                                className="page-link"
                                                onClick={e => this.handleClick(page, e)}
                                            >
                                                {page}
                                            </a>
                                        </li>
                                    );
                                })}
                            </ul>
                        </nav>
                    </div>
                    <div className="d-flex align-items-center py-3">
                        <select
                            disabled={this.totalRecords === 0}
                            className={`form-control form-control-sm font-weight-bold mr-4 border-0 bg-light ${this.totalRecords ===
                                0 && "disabled"}`}
                            onChange={this.onSizeChange}
                            value={this.pageLimit}
                            style={style}
                        >
                            {[{ text: '10', page: 10 }, { text: '25', page: 25 }, { text: '50', page: 50 }].map(option => {
                                const isSelect = this.pageLimit === `${option.page}`;
                                return (
                                    <option
                                        key={option.text}
                                        value={option.page}
                                        className={`btn ${isSelect ? "active" : ""}`}
                                    >
                                        {option.text}
                                    </option>
                                );
                            })}
                        </select>

                        <span className="react-bootstrap-table-pagination-total">&nbsp; {this.showingRecords()} &nbsp; &nbsp; </span>
                        {this.props.isLoading && <div className="d-flex align-items-center">
                            <div className="mr-2 text-muted">Loading...</div>
                            <div className="spinner spinner-primary mr-10"></div>
                        </div>}
                    </div>
                </div>


            </Fragment>
        );
    }
}

CtmPagination.propTypes = {
    totalRecords: PropTypes.number.isRequired,
    pageLimit: PropTypes.number,
    pageNeighbours: PropTypes.number,
    onPageChanged: PropTypes.func
};

export default CtmPagination;
