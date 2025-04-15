export function getPaginationParams(url: string) {
    const { searchParams } = new URL(url);
  
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("page_size") || "10", 10);
  
    if (page < 1 || pageSize < 1) {
      throw new Error("Invalid pagination parameters.");
    }
  
    const skip = (page - 1) * pageSize;
    const take = pageSize;
  
    return { skip, take, page, pageSize };
  }
  