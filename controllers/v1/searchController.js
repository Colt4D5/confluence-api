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
    const offset = req.query.offset || 0;

    if (!query) {
      return res.status(400).json({
        message: "Query is required",
      });
    }

    const params = new URLSearchParams({
        cql: `title~"*${query}*" AND space=${CONFLUENCE_SPACE_KEY}`,
        limit,
        offset,
        expand: "content.version,content.history,content.metadata.labels",
    });

    const response = await fetch(
      `${CONFLUENCE_BASE_URL}/wiki/rest/api/search?${params}`,
      { headers: this.#headers }
    );

    let data = await response.json()

    if (data.results.length === 0) {
      return res.status(204).json({
        message: "No results found",
        data: []
      });
    }

    return res.status(200).json({
      data: data.results
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

    console.log("Status code:", response.status)
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