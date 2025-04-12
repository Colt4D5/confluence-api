const CONFLUENCE_USERNAME = process.env.CONFLUENCE_USERNAME;
const CONFLUENCE_API_TOKEN = process.env.CONFLUENCE_API_TOKEN;
const CONFLUENCE_BASE_URL = process.env.CONFLUENCE_BASE_URL;
const CONFLUENCE_SPACE_KEY = process.env.CONFLUENCE_SPACE_KEY;

class TagsController {
  #headers = {}
  constructor() {
    this.#headers = {
      Authorization: `Basic ${Buffer.from(`${CONFLUENCE_USERNAME}:${CONFLUENCE_API_TOKEN}`).toString('base64')}`,
      'Content-Type': 'application/json; charset=UTF-8',
      Accept: 'application/json',
    }
  }

  async getTagsByDocId(req, res) {
    const { id } = req.query;

    // return res.status(400).json({
    //   message: "ID is required",
    // });

    if (!id) {
      return res.status(400).json({
        message: "ID is required",
      });
    }

    const params = new URLSearchParams({
        cql: `space=${CONFLUENCE_SPACE_KEY}`,
        expand: "metadata.labels",
    });

    const response = await fetch(
      `${CONFLUENCE_BASE_URL}/wiki/rest/api/content/${id}?${params.toString()}`,
      { headers: this.#headers }
    );

    let data = await response.json();
    // console.log(data);

    if (!data.metadata || !data.metadata.labels) {
      return res.status(204).json({
        message: "No results found",
        data: []
      });
    }

    const labels = data.metadata.labels.results.map((label) => label.name);

    return res.status(200).json({
      data: data.metadata.labels || [],
      labels,
      message: "Tags retrieved successfully"
    });
  }
}

export default new TagsController()