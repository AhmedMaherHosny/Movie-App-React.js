const SearchBar = ({searchText, setSearchText}) => {
    return (
        <div className="search">
            <div>
                <img src="search.svg" alt="search icon"/>
                <input type="text" placeholder="Search for a movie..." value={searchText}
                       onChange={(e) => setSearchText(e.target.value)}/>
            </div>
        </div>
    )
}
export default SearchBar
