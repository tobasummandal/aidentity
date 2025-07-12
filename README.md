# (AI)DENTITY: Who Are We in the Age of Algorithms?

An interactive exploration of global AI perspectives based on research analyzing 59,542 voices across three continents.

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/aidentity.git
   cd aidentity
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## Features

- **Personal Narrative**: Starts with relatable stories and builds to global insights
- **Interactive Quiz**: Discover which of 5 AI personas matches your perspective
- **Real Research Data**: Based on actual survey responses from 59,542 participants
- **Regional Analysis**: Explore how geography shapes AI attitudes
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Data Visualizations**: Dynamic charts showing persona distributions and fear profiles

## The Five AI Personas

1. **Balanced Social Participant** (59.4%) - Cautiously optimistic, values human connection
2. **Consistent Social Responder** (22.2%) - Thoughtful engagement, social justice focus  
3. **Balanced Security Participant** (3.4%) - Prioritizes safety and regulation
4. **Cultural Preservationist** (8.4%) - Concerned about tradition and values
5. **Technology-Aware Participant** (6.6%) - Understanding of risks while remaining engaged

## Data Sources

This project analyzes survey data from:
- **GD1**: North American participants
- **GD2**: European participants  
- **GD3**: Asia-Pacific participants

Total: 59,542 individual responses across 10 key dimensions of AI concern.

## Technical Stack

- **Frontend**: React 18, Tailwind CSS, Recharts, D3.js
- **Backend**: Node.js, Express
- **Data Processing**: Custom algorithms for persona classification
- **Deployment**: Optimized for Vercel/Netlify

## Project Structure

```
src/
├── components/          # Reusable UI components
├── data/               # Research data and constants
├── utils/              # Helper functions and calculations
└── styles/             # CSS and styling

backend/
├── routes/             # API endpoints
├── data/               # Raw and processed datasets
└── utils/              # Data processing utilities
```

## Development

### Available Scripts

- `npm start` - Run frontend only
- `npm run server` - Run backend only  
- `npm run dev` - Run both frontend and backend
- `npm run build` - Build for production
- `npm test` - Run tests

### Adding New Data

1. Place CSV files in `backend/data/raw/`
2. Run data processing: `node backend/utils/dataProcessor.js`
3. Update persona calculations in `backend/utils/personaCalculator.js`

## API Endpoints

- `GET /api/personas` - Get all persona data
- `POST /api/quiz/submit` - Submit quiz responses and get persona match
- `GET /api/data/regional` - Get regional comparison data
- `GET /api/data/distribution` - Get persona distribution data

## Customization

### Styling
- Tailwind classes can be customized in `tailwind.config.js`
- Component-specific styles in individual component files

### Data Visualization
- Chart configurations in `src/components/DataVisualization.js`
- Color schemes defined in `src/data/personaData.js`

### Quiz Logic
- Questions in `src/data/quizQuestions.js`
- Scoring algorithm in `src/utils/calculations.js`

## Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
# Upload dist folder to Netlify
```

### Traditional Hosting
```bash
npm run build
# Upload build folder to your hosting provider
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Research participants who shared their perspectives
- Data visualization inspiration from The Pudding
- Open source community for tools and libraries
```
