import "./SearchBar.scss";

const SearchBar = (props) => {

    const {handleSubmit} = props;
    return(
        <>
            <form onSubmit={handleSubmit}>
                <input
                placeholder="Search By City"
                type="text">
                </input>
                <button>Search!</button>
            </form>
        </>
    )
}

export default SearchBar;