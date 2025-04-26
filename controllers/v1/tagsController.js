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

  async addTags(req, res) {
    const { id } = req.params;
    let { tags } = req.body;

    if (!id) {
      return res.status(400).json({
        message: "ID is required",
      });
    }

    if (!tags || tags.length === 0) {
      return res.status(400).json({
        message: "Tags are required",
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

    if (!data.metadata || !data.metadata.labels) {
      return res.status(204).json({
        message: "No results found",
        data: []
      });
    }

    tags = tags.map((label) => ({
      prefix: "global",
      name: label,
    }));

    const updateResponse = await fetch(
      `${CONFLUENCE_BASE_URL}/wiki/rest/api/content/${id}/label`,
      {
        method: "POST",
        headers: { ...this.#headers, "Content-Type": "application/json" },
        body: JSON.stringify(tags),
      }
    );

    let updateData = await updateResponse.json();

    return res.status(200).json({
      tags,
      message: "Tags added successfully"
    });
  }

  async deleteTag(req, res) {
    const { id } = req.params;
    const { tag } = req.body;

    if (!id) {
      return res.status(400).json({
        message: "ID is required",
      });
    }

    if (!tag) {
      return res.status(400).json({
        message: "Tag is required",
      });
    }

    const params = new URLSearchParams({
        cql: `space=${CONFLUENCE_SPACE_KEY}`,
        expand: "metadata.labels",
        name: tag,
    });

    const response = await fetch(
      `${CONFLUENCE_BASE_URL}/wiki/rest/api/content/${id}/label?${params.toString()}`,
      { headers: this.#headers }
    );

    let data = await response.json();

    if (!data) {
      return res.status(204).json({
        message: "No results found",
        data: []
      });
    }

    const updateResponse = await fetch(
      `${CONFLUENCE_BASE_URL}/wiki/rest/api/content/${id}/label?name=${tag}`,
      {
        method: "DELETE",
        headers: this.#headers,
      }
    );

    // check if the tag was deleted successfully
    if (updateResponse.status !== 204) {
      return res.status(400).json({
        message: "Failed to delete the tag or tag does not exist",
      });
    }

    return res.status(200).json({
      tag,
      message: "Tags deleted successfully"
    });
  }
}

export default new TagsController()