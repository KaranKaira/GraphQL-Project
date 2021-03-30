import React ,{useState}from 'react';
import { useQuery } from '@apollo/client';
import { getBooksQuery } from '../queries/queries';
import BookDetails from './BookDetails';

function BookList() {
  const { loading, data } = useQuery(getBooksQuery);

  const [selected, setSelected] = useState({
    selected: null,
  });

  
  function displayBooks() {
    if (loading) {
      return <h1>loading...</h1>;
    } else {
      return data.books.map((book) => {
        return (
          <li key={book.id} onClick={(e) =>{setSelected({selected : book.id})}}>
            {book.name}
          </li>
        );
      });
    }
  }

  return (
    <div className='main'>
      <ul id='book-list'>{displayBooks()}</ul>
      <BookDetails bookId = {selected}/>
    </div>
  );
}

export default BookList;
