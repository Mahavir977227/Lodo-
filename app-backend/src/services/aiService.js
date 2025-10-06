/**
 * @fileoverview AI Service to manage the loading and handling of AI models.
 * Uses the Singleton pattern to ensure the model is loaded only once.
 */

class AIModelManager {
  static instance = null;
  pipeline = null;

  // Private constructor to enforce singleton pattern
  constructor() {}

  /**
   * Gets the singleton instance of the model manager.
   * If an instance doesn't exist, it creates one and loads the model.
   * @returns {Promise<AIModelManager>} The singleton instance.
   */
  static async getInstance() {
    if (this.instance === null) {
      this.instance = new AIModelManager();
      await this.instance.loadModel();
    }
    return this.instance;
  }

  /**
   * Loads the AI model using a dynamic import, which is required for ES Modules
   * like '@xenova/transformers' in a CommonJS environment.
   */
  async loadModel() {
    try {
      // Use dynamic import for ES Modules in CommonJS
      const { pipeline } = await import('@xenova/transformers');

      console.log('Loading sentiment analysis model...');
      // This is a lightweight model suitable for demonstrating pre-loading.
      // The model will be downloaded and cached on the first run.
      this.pipeline = await pipeline('sentiment-analysis', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english');

      console.log('AI model loaded successfully.');
    } catch (error) {
      console.error('Fatal: Failed to load the AI model. The application cannot start without it.', error);
      // Exit the process if the core AI model cannot be loaded.
      process.exit(1);
    }
  }

  /**
   * Returns the loaded pipeline.
   * @returns {Function} The transformer pipeline.
   * @throws {Error} If the model is not loaded yet.
   */
  getPipeline() {
    if (!this.pipeline) {
      throw new Error('AI model is not loaded. Ensure getInstance() is awaited at startup.');
    }
    return this.pipeline;
  }
}

module.exports = AIModelManager;