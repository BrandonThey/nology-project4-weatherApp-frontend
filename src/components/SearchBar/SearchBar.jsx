import "./SearchBar.scss";

const SearchBar = (props) => {

    //simple search bar input and button form
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