import React, { useState } from 'react';
import './App.css';


// const OPENAI_API_KEY = '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';
// const OPENAI_API_KEY = process.env.API_KEY

const CHAT_API_ENDPOINT_URL = 'https://api.openai.com/v1/chat/completions';
const IMAGE_API_ENDPOINT_URL = 'https://api.openai.com/v1/images/generations';

function App() {
  const [productIdea, setProductIdea] = useState('');
  const [iconImageUrl, setIconImageUrl] = useState('');
  const [productList, setProductList] = useState([]);
  const [error, setError] = useState(null);

  const fetchProduct = async (productIdea) => {
    const prompt = `Based on the product idea "${productIdea}", recommend product name as heading and key features of product on subsequent lines .`; // Adapt the prompt as needed

    const options = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_APIKEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo', // Adjust model based on your choices
        messages: [
          { role: 'system', content: 'You are a helpful AI assistant.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7, // Control response creativity; 0 is deterministic, 1 is most random
        max_tokens: 150, // Maximum number of tokens to generate
        n: 1, // Number of completions to generate
      }),
    };

    try {
      const response = await fetch(CHAT_API_ENDPOINT_URL, options);
      const responseData = await response.json();

      console.log('Response Data:', responseData);
      if (responseData.choices && responseData.choices.length > 0) {
        const completionMessage = responseData.choices[0].message.content;

        if (completionMessage) {
          const recommendations = completionMessage.trim();
          setProductList([recommendations]);
          console.log('Product Recommendations:', recommendations);
        } else {
          throw new Error('No completion message or text found in API response');
        }
      } else {
        throw new Error('No choices found in API response');
      }
    } catch (error) {
      console.error('Error fetching product recommendations:', error);
      setError('Error generating product recommendations. Please try again later.');
    }
  };

  const fetchIconImage = async (productIdea) => {
    const options = {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_APIKEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: "Create a vector icon reprsenting " + productIdea + "a minimilist, single color, line art style",
        n: 1,
        size: "256x256"
      })
    }
    try {
      const response = await fetch(IMAGE_API_ENDPOINT_URL, options);
      const responseData = await response.json();
      console.log(responseData);
      if (responseData.data && responseData.data.length > 0) {
        // Extract the image URL from the first element of the data array
        return responseData.data[0].url;
      } else {
        throw new Error('Image URL not found in response data');
      }
    } catch (error) {
      console.error('Error fetching icon image:', error);
      setError('Error fetching icon image. Please try again later.');
      return null;
    }
  };

  const handleInputChange = (event) => {
    setProductIdea(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    console.log('Product Idea Submitted:', productIdea);

    try {
      const iconImageText = await fetchIconImage(productIdea);
      await fetchProduct(productIdea);

      if (iconImageText) {
        setIconImageUrl(iconImageText);
      }
    } catch (error) {
      console.error('Error handling form submission:', error);
      setError('Error processing request. Please try again later.');
    }
  };

  return (
    <div className="App">
      <svg id="visual" viewBox="0 0 900 600" version="1.1">
        <rect x="0" y="0" width="100vw" height="100vh" fill="#001220"></rect>
        <path d="M0 345L10 356.5C20 368 40 391 60 390.8C80 390.7 100 367.3 120 360.8C140 354.3 160 364.7 180 370.2C200 375.7 220 376.3 240 383.5C260 390.7 280 404.3 300 406.7C320 409 340 400 360 387.3C380 374.7 400 358.3 420 350.5C440 342.7 460 343.3 480 345.3C500 347.3 520 350.7 540 361.8C560 373 580 392 600 400.3C620 408.7 640 406.3 660 403C680 399.7 700 395.3 720 392.5C740 389.7 760 388.3 780 383.8C800 379.3 820 371.7 840 365.8C860 360 880 356 890 354L900 352L900 601L890 601C880 601 860 601 840 601C820 601 800 601 780 601C760 601 740 601 720 601C700 601 680 601 660 601C640 601 620 601 600 601C580 601 560 601 540 601C520 601 500 601 480 601C460 601 440 601 420 601C400 601 380 601 360 601C340 601 320 601 300 601C280 601 260 601 240 601C220 601 200 601 180 601C160 601 140 601 120 601C100 601 80 601 60 601C40 601 20 601 10 601L0 601Z" fill="#fa7268"></path><path d="M0 397L10 395.3C20 393.7 40 390.3 60 395.5C80 400.7 100 414.3 120 425.2C140 436 160 444 180 443.2C200 442.3 220 432.7 240 427.2C260 421.7 280 420.3 300 418.8C320 417.3 340 415.7 360 420.8C380 426 400 438 420 437.3C440 436.7 460 423.3 480 417.3C500 411.3 520 412.7 540 414.7C560 416.7 580 419.3 600 423.8C620 428.3 640 434.7 660 433C680 431.3 700 421.7 720 415.2C740 408.7 760 405.3 780 411.7C800 418 820 434 840 437.5C860 441 880 432 890 427.5L900 423L900 601L890 601C880 601 860 601 840 601C820 601 800 601 780 601C760 601 740 601 720 601C700 601 680 601 660 601C640 601 620 601 600 601C580 601 560 601 540 601C520 601 500 601 480 601C460 601 440 601 420 601C400 601 380 601 360 601C340 601 320 601 300 601C280 601 260 601 240 601C220 601 200 601 180 601C160 601 140 601 120 601C100 601 80 601 60 601C40 601 20 601 10 601L0 601Z" fill="#ef5f67"></path><path d="M0 445L10 444C20 443 40 441 60 441.7C80 442.3 100 445.7 120 445.7C140 445.7 160 442.3 180 448C200 453.7 220 468.3 240 467.2C260 466 280 449 300 448C320 447 340 462 360 467.7C380 473.3 400 469.7 420 471.2C440 472.7 460 479.3 480 474.3C500 469.3 520 452.7 540 450C560 447.3 580 458.7 600 468.3C620 478 640 486 660 489.2C680 492.3 700 490.7 720 488.7C740 486.7 760 484.3 780 482.3C800 480.3 820 478.7 840 479.3C860 480 880 483 890 484.5L900 486L900 601L890 601C880 601 860 601 840 601C820 601 800 601 780 601C760 601 740 601 720 601C700 601 680 601 660 601C640 601 620 601 600 601C580 601 560 601 540 601C520 601 500 601 480 601C460 601 440 601 420 601C400 601 380 601 360 601C340 601 320 601 300 601C280 601 260 601 240 601C220 601 200 601 180 601C160 601 140 601 120 601C100 601 80 601 60 601C40 601 20 601 10 601L0 601Z" fill="#e34c67"></path><path d="M0 502L10 502.3C20 502.7 40 503.3 60 505C80 506.7 100 509.3 120 507.5C140 505.7 160 499.3 180 502.2C200 505 220 517 240 514.7C260 512.3 280 495.7 300 491.7C320 487.7 340 496.3 360 504.3C380 512.3 400 519.7 420 518C440 516.3 460 505.7 480 501C500 496.3 520 497.7 540 502.7C560 507.7 580 516.3 600 520.8C620 525.3 640 525.7 660 519.3C680 513 700 500 720 496C740 492 760 497 780 497.8C800 498.7 820 495.3 840 493.8C860 492.3 880 492.7 890 492.8L900 493L900 601L890 601C880 601 860 601 840 601C820 601 800 601 780 601C760 601 740 601 720 601C700 601 680 601 660 601C640 601 620 601 600 601C580 601 560 601 540 601C520 601 500 601 480 601C460 601 440 601 420 601C400 601 380 601 360 601C340 601 320 601 300 601C280 601 260 601 240 601C220 601 200 601 180 601C160 601 140 601 120 601C100 601 80 601 60 601C40 601 20 601 10 601L0 601Z" fill="#d53867"></path><path d="M0 531L10 533.3C20 535.7 40 540.3 60 541.2C80 542 100 539 120 539.7C140 540.3 160 544.7 180 548.3C200 552 220 555 240 551.8C260 548.7 280 539.3 300 540.8C320 542.3 340 554.7 360 558C380 561.3 400 555.7 420 550C440 544.3 460 538.7 480 541.8C500 545 520 557 540 557C560 557 580 545 600 540C620 535 640 537 660 537.3C680 537.7 700 536.3 720 542C740 547.7 760 560.3 780 562C800 563.7 820 554.3 840 548.5C860 542.7 880 540.3 890 539.2L900 538L900 601L890 601C880 601 860 601 840 601C820 601 800 601 780 601C760 601 740 601 720 601C700 601 680 601 660 601C640 601 620 601 600 601C580 601 560 601 540 601C520 601 500 601 480 601C460 601 440 601 420 601C400 601 380 601 360 601C340 601 320 601 300 601C280 601 260 601 240 601C220 601 200 601 180 601C160 601 140 601 120 601C100 601 80 601 60 601C40 601 20 601 10 601L0 601Z" fill="#c62368"></path>
      </svg>
      <h1>Product Idea Input</h1>
      <div className="form-container">
        <div className="input-container">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter your product idea/request"
              value={productIdea}
              onChange={handleInputChange}
            />
          </form>
          {iconImageUrl && (
            <div className="generated-image">
              <img src={iconImageUrl} alt="Generated Icon" />
            </div>
          )}
        </div>
        <div className="product-list">
          <h2>Product Recommendations</h2>
          <ul>
            {productList.map((product, index) => (
              <li key={index}>
                <h3>{product.split('\n')[0]}</h3> {/* Assuming the product name is on the first line */}
                <ul>
                  {product.split('\n').slice(1).map((feature, index) => (
                    <li key={index}>{feature}</li> // Assuming the rest of the lines are features
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          {error && <p className="error">{error}</p>}
        </div>

      </div>
    </div>
  );
}

export default App;
