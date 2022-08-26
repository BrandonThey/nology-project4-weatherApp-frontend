import "./SearchBar.scss";

const SearchBar = (props) => {

    const {handleSubmit} = props;
    return(
        <>
            <form onSubmit={handleSubmit}>
                <input
                placeholder="search"
                type="text">
                </input>
                <button>Search!</button>
            </form>
        </>
    )
}

export default SearchBar;