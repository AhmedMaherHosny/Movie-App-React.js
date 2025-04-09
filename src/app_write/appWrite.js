import {Client, Databases, ID, Query} from 'appwrite';

const APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const APPWRITE_DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const APPRITE_METRICS_COLLECTION_ID = import.meta.env.VITE_APPRITE_METRICS_COLLECTION_ID;

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(APPWRITE_PROJECT_ID)
const database = new Databases(client)

export const updateSearchCount = async (searchText, movie) => {
    try {
        const result = await database
            .listDocuments(APPWRITE_DATABASE_ID,
                APPRITE_METRICS_COLLECTION_ID, [
                    Query.equal('searchText', searchText),
                ])
        if (result.documents.length > 0) {
            const doc = result.documents[0]
            await database.updateDocument(APPWRITE_DATABASE_ID,
                APPRITE_METRICS_COLLECTION_ID, doc.$id, {
                    count: doc.count + 1,
                })
        } else {
            await database.createDocument(APPWRITE_DATABASE_ID,
                APPRITE_METRICS_COLLECTION_ID, ID.unique(), {
                    searchText: searchText,
                    count: 1,
                    posterUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                    movieId: movie.id,
                })
        }
    } catch (error) {
        console.error(error)
    }
}
export const getTrendingMovies = async () => {
    try {
        const result = await database.listDocuments(APPWRITE_DATABASE_ID, APPRITE_METRICS_COLLECTION_ID, [
            Query.limit(5),
            Query.orderDesc("count")
        ])

        return result.documents;
    } catch (error) {
        console.error(error);
    }
}
