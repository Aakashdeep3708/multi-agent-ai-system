from pymilvus import FieldSchema, CollectionSchema, DataType, Collection, utility

# -------------------------------
# 🔧 Configuration
# -------------------------------
COLLECTION_NAME = "rag_docs"
EMBEDDING_DIM = 384  # use 384 for MiniLM; 768/1536 for other models

# -------------------------------
# ✅ Create Milvus Collection
# -------------------------------
def create_milvus_collection():
    if utility.has_collection(COLLECTION_NAME):
        print(f"Collection '{COLLECTION_NAME}' already exists.")
        return Collection(name=COLLECTION_NAME)

    fields = [
        FieldSchema(name="id", dtype=DataType.INT64, is_primary=True, auto_id=True),
        FieldSchema(name="embedding", dtype=DataType.FLOAT_VECTOR, dim=EMBEDDING_DIM),
        FieldSchema(name="text", dtype=DataType.VARCHAR, max_length=2000),
    ]
    schema = CollectionSchema(fields, description="RAG Document Chunks")
    collection = Collection(name=COLLECTION_NAME, schema=schema)
    print(f"Collection '{COLLECTION_NAME}' created.")
    return collection

# -------------------------------
# ✅ Insert and Index Chunks
# -------------------------------
def insert_and_index_chunks(collection, vectors, texts):
    if not texts or not vectors:
        raise ValueError("No data to insert.")
    if len(vectors) != len(texts):
        raise ValueError("Mismatch between number of vectors and texts.")

    data_to_insert = [vectors, texts]
    collection.insert(data_to_insert)
    collection.flush()
    print(f"Inserted {len(texts)} chunks into '{COLLECTION_NAME}'.")

    if not collection.has_index():
        collection.create_index(
            field_name="embedding",
            index_params={
                "metric_type": "L2",
                "index_type": "IVF_FLAT",
                "params": {"nlist": 128}
            }
        )
        print("Index created.")

    collection.load()
    print("Collection loaded into memory.")