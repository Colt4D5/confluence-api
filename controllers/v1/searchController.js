const CONFLUENCE_USERNAME = process.env.CONFLUENCE_USERNAME;
const CONFLUENCE_API_TOKEN = process.env.CONFLUENCE_API_TOKEN;
const CONFLUENCE_BASE_URL = process.env.CONFLUENCE_BASE_URL;
const CONFLUENCE_SPACE_KEY = process.env.CONFLUENCE_SPACE_KEY;

class SearchController {
  #headers = {}
  constructor() {
    this.#headers = {
      Authorization: `Basic ${Buffer.from(`${CONFLUENCE_USERNAME}:${CONFLUENCE_API_TOKEN}`).toString('base64')}`,
      'Content-Type': 'application/json; charset=UTF-8',
      Accept: 'application/json',
    }
  }

  async fetchDocs(req, res) {
    const { query } = req.params;
    const limit = req.query.limit || 10;
    const start = req.query.start || 0;

    if (!query) {
      return res.status(400).json({
        message: "Query is required",
      });
    }

    const params = new URLSearchParams({
        cql: `title~"*${query}*" AND space=${CONFLUENCE_SPACE_KEY} AND type=page`,
        limit,
        start,
        expand: "content.version,content.history,content.metadata.labels",
    });

    const apiUrl = `/wiki/rest/api/search?${params}`;


    const response = await fetch(
      `${CONFLUENCE_BASE_URL}${apiUrl}`,
      { headers: this.#headers }
    );

    let data = await response.json()

    return res.status(200).json({
      data: data
    });
  }

  async fetchNextDocs(req, res) {
    const { nextlink } = req.query;
    
    if (!nextlink) {
      return res.status(400).json({
        message: "Link is required",
      });
    }

    const decodedLink = decodeURIComponent(nextlink).split('?')[1];

    const response = await fetch(
      `${CONFLUENCE_BASE_URL}/wiki/rest/api/search?${decodedLink}`,
      { headers: this.#headers }
    );

    let data = await response.json();

    if (response.status !== 200) {
      return res.status(response.status).json({
        message: "Error fetching data",
        data: []
      });
    }

    return res.status(200).json({
      data: data
    });
  }

  async fetchDocById(req, res) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "ID is required",
      });
    }

    const response = await fetch(
      `${CONFLUENCE_BASE_URL}/wiki/rest/api/content/${id}?expand=body.storage,version`,
      { headers: this.#headers }
    );

    let data = await response.json();

    if (!data || !data.version || data.status === 'error') {
      return res.status(404).json({
        message: "Document not found",
        data: []
      });
    }

    return res.status(200).json({
      data: data
    });
  }
}

export default new SearchController()