import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  getAuthorsQuery,
  addBookMutation,
  getBooksQuery,
} from '../queries/queries';

function AddBook() {
  const { loading, data } = useQuery(getAuthorsQuery); //? get the data from the db

  function displayAuthors() {
    if (loading) {
      return <option disabled>loading Authors</option>;
    } else {
      return data.authors.map((author) => {
        return (
          <option key={author.id} name='authorName' value={author.id}>
            {author.name}
          </option>
        );
      });
    }
  }
  const [info, setInfo] = useState({
    name: '',
    genre: '',
    authorId: '',
  });
  function handleChange(e) {
    const { name, value } = e.target;

    setInfo((prevVal) => {
      return {
        ...prevVal,
        [name]: value,
      };
    });
  }
  const [addBook] = useMutation(addBookMutation);

  function handleSubmit(e) {
    e.preventDefault();
    //? save this info to db - mutation
    //! console.log(info);
    //? send these variable to the mutation query
    addBook({
      variables: {
        name: info.name,
        genre: info.genre,
        authorId: info.authorId,
      },
      refetchQueries: [{ query: getBooksQuery }], //? this will again make request for the list of books
    });

    //? clear the input fields
    setInfo({
      name: '',
      genre: '',
      authorId: '',
    });
  }
  return (
    <form id='add-book' onSubmit={handleSubmit}>
      <div className='field'>
        <label>Book name:</label>
        <input
          type='text'
          name='name'
          value={info.name}
          onChange={handleChange}
        />
      </div>

      <div className='field'>
        <label>Genre:</label>
        <input
          type='text'
          name='genre'
          value={info.genre}
          onChange={handleChange}
        />
      </div>

      <div className='field'>
        <label>Author:</label>
        <select name='authorId' onChange={handleChange} value={info.authorId}>
          <option>Select Author</option>
          {displayAuthors()}
        </select>
      </div>

      <button>+</button>
    </form>
  );
}

export default AddBook;
