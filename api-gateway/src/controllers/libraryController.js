const grpcClient = require('../grpc/grpcClient');

const createBook = (req, res, next) => {
    console.log(`src/controllers/libraryController.js: createBook: called with body: ${JSON.stringify(req.body)}`);
    const { title, author, published_date, isbn } = req.body;

    if (!published_date) {
        const error = new Error('published_date is a required field.');
        console.error(`src/controllers/libraryController.js: createBook: Error:`, error.message);
        return res.status(400).json({ error: error.message });
    }

    const createBookRequest = {
        title: title,
        author: author,
        isbn: isbn,
        published_date: published_date // Pass the string directly
    };
    console.log(`src/controllers/libraryController.js: createBook: calling grpcClient.createBook with request: ${JSON.stringify(createBookRequest)}`);

    grpcClient.createBook(createBookRequest, (error, response) => {
        if (error) {
            console.error(`src/controllers/libraryController.js: createBook: Error:`, error);
            return next(error);
        }
        console.log(`src/controllers/libraryController.js: createBook: returning response: ${JSON.stringify(response.book)}`);
        res.status(201).json(response.book);
    });
};

const updateBook = (req, res, next) => {
    console.log(`src/controllers/libraryController.js: updateBook: called with body: ${JSON.stringify(req.body)}`);
    const { id, title, author, published_date, isbn } = req.body;

    if (!published_date) {
        const error = new Error('published_date is a required field.');
        console.error(`src/controllers/libraryController.js: updateBook: Error:`, error.message);
        return res.status(400).json({ error: error.message });
    }

    const updateBookRequest = {
        id: id,
        title: title,
        author: author,
        isbn: isbn,
        published_date: published_date // Pass the string directly
    };

    grpcClient.updateBook(updateBookRequest, (error, response) => {
        if (error) {
            console.error(`src/controllers/libraryController.js: updateBook: Error:`, error);
            return next(error);
        }
        console.log(`src/controllers/libraryController.js: updateBook: returning response: ${JSON.stringify(response.book)}`);
        res.json(response.book);
    });
};

const deleteBook = (req, res, next) => {
    console.log(`src/controllers/libraryController.js: deleteBook: called with params: ${JSON.stringify(req.params)}`);
    const { id } = req.params;
    grpcClient.deleteBook({ id }, (error, response) => {
        if (error) {
            console.error(`src/controllers/libraryController.js: deleteBook: Error:`, error);
            return next(error);
        }
        console.log(`src/controllers/libraryController.js: deleteBook: returning success`);
        res.status(204).send();
    });
};

const getBook = (req, res, next) => {
    console.log(`src/controllers/libraryController.js: getBook: called with params: ${JSON.stringify(req.params)}`);
    const { id } = req.params;
    grpcClient.getBook({ id }, (error, response) => {
        if (error) {
            console.error(`src/controllers/libraryController.js: getBook: Error:`, error);
            return next(error);
        }
        console.log(`src/controllers/libraryController.js: getBook: returning response: ${JSON.stringify(response)}`);
        res.json(response);
    });
};

const listBooks = (req, res, next) => {
    console.log(`src/controllers/libraryController.js: listBooks: called`);
    grpcClient.listBooks({}, (error, response) => {
        if (error) {
            console.error(`src/controllers/libraryController.js: listBooks: Error:`, error);
            return next(error);
        }
        console.log(`src/controllers/libraryController.js: listBooks: returning response: ${JSON.stringify(response.books)}`);
        res.json(response.books);
    });
};

const updateMember = (req, res, next) => {
    console.log(`src/controllers/libraryController.js: updateMember: called with params: ${JSON.stringify(req.params)} and body: ${JSON.stringify(req.body)}`);
    const { id } = req.params; // Get ID from URL parameters
    const { name, email } = req.body; // Get name and email from request body
    grpcClient.updateMember({ id, name, email }, (error, response) => {
        if (error) {
            console.error(`src/controllers/libraryController.js: updateMember: Error:`, error);
            return next(error);
        }
        console.log(`src/controllers/libraryController.js: updateMember: returning response: ${JSON.stringify(response.member)}`);
        res.json(response.member);
    });
};

const deleteMember = (req, res, next) => {
    console.log(`src/controllers/libraryController.js: deleteMember: called with params: ${JSON.stringify(req.params)}`);
    const { id } = req.params;
    grpcClient.deleteMember({ id }, (error, response) => {
        if (error) {
            console.error(`src/controllers/libraryController.js: deleteMember: Error:`, error);
            return next(error);
        }
        console.log(`src/controllers/libraryController.js: deleteMember: returning success`);
        res.status(204).send();
    });
};

const getMember = (req, res, next) => {
    console.log(`src/controllers/libraryController.js: getMember: called with params: ${JSON.stringify(req.params)}`);
    const { id } = req.params;
    grpcClient.getMember({ id }, (error, response) => {
        if (error) {
            console.error(`src/controllers/libraryController.js: getMember: Error:`, error);
            return next(error);
        }
        console.log(`src/controllers/libraryController.js: getMember: returning response: ${JSON.stringify(response)}`);
        res.json(response);
    });
};

const listMembers = (req, res, next) => {
    console.log(`src/controllers/libraryController.js: listMembers: called`);
    grpcClient.listMembers({}, (error, response) => {
        if (error) {
            console.error(`src/controllers/libraryController.js: listMembers: Error:`, error);
            return next(error);
        }
        console.log(`src/controllers/libraryController.js: listMembers: returning response: ${JSON.stringify(response.members)}`);
        res.json(response.members);
    });
};

const listBorrowings = (req, res, next) => {
    console.log(`src/controllers/libraryController.js: listBorrowings: called`);
    grpcClient.ListBorrowings({}, (error, response) => { // Using ListBorrowings as per proto
        if (error) {
            console.error(`src/controllers/libraryController.js: listBorrowings: Error:`, error);
            return next(error);
        }
        // Assuming response.borrowings is a list of BorrowingDetails
        console.log(`src/controllers/libraryController.js: listBorrowings: returning response with ${response.borrowings.length} borrowings`);
        res.json(response.borrowings);
    });
};

const returnBorrowing = (req, res, next) => {
    console.log(`src/controllers/libraryController.js: returnBorrowing: called with params: ${JSON.stringify(req.params)}`);
    const { id } = req.params; // borrowing record ID from URL parameter
    grpcClient.ReturnBook({ borrow_record_id: id }, (error, response) => { // Using ReturnBook as per proto
        if (error) {
            console.error(`src/controllers/libraryController.js: returnBorrowing: Error:`, error);
            return next(error);
        }
        console.log(`src/controllers/libraryController.js: returnBorrowing: returning response: ${JSON.stringify(response.borrow_record)}`);
        res.json(response.borrow_record);
    });
};

const createMember = (req, res, next) => {
    console.log(`src/controllers/libraryController.js: createMember: called with body: ${JSON.stringify(req.body)}`);
    const { name, email } = req.body;
    grpcClient.createMember({ name, email }, (error, response) => {
        if (error) {
            console.error(`src/controllers/libraryController.js: createMember: Error:`, error);
            return next(error);
        }
        console.log(`src/controllers/libraryController.js: createMember: returning response: ${JSON.stringify(response.member)}`);
        res.status(201).json(response.member);
    });
};

const borrowBook = (req, res, next) => {
    console.log(`src/controllers/libraryController.js: borrowBook: called with body: ${JSON.stringify(req.body)}`);
    const { book_id, member_id } = req.body;
    grpcClient.borrowBook({ book_id, member_id }, (error, response) => {
        if (error) {
            console.error(`src/controllers/libraryController.js: borrowBook: Error:`, error);
            return next(error);
        }
        console.log(`src/controllers/libraryController.js: borrowBook: returning response: ${JSON.stringify(response.borrow_record)}`);
        res.json(response.borrow_record);
    });
};





module.exports = {
    createBook,
    updateBook,
    deleteBook,
    getBook,
    listBooks,
    createMember,
    updateMember,
    deleteMember,
    getMember,
    listMembers,
    borrowBook,
    listBorrowings, // New
    returnBorrowing, // New
};
