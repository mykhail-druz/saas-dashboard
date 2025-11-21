# Screenshots for Showcase Section

This folder contains dashboard page screenshots that are displayed in the "See capabilities in action" section on the landing page.

## Required Files

The following screenshots need to be added:

1. **interactive-charts.png** - Screenshot of Dashboard page (`/dashboard`) with charts:
   - Revenue Trend (LineChart)
   - Traffic Overview (AreaChart)
   - Top Users (BarChart)
   - Category Distribution (PieChart)
   - Recommended size: 1920x1080px (16:9 aspect ratio)

2. **trend-analysis.png** - Dashboard screenshot with focus on trend charts:
   - Revenue Trend
   - Traffic Overview
   - KPI cards with metrics
   - Recommended size: 1920x1080px (16:9 aspect ratio)

3. **detailed-analytics.png** - Screenshot of Reports page (`/reports`) or Dashboard with detailed metrics:
   - Reports table
   - Or detailed analytics view
   - Recommended size: 1920x1080px (16:9 aspect ratio)

## How to Create Screenshots

1. Run the application in development mode: `npm run dev`
2. Log in and navigate to the desired page
3. Take a screenshot of the page (you can use built-in browser tools or extensions)
4. Save the screenshot in this folder with the corresponding name
5. Make sure the screenshot has a 16:9 aspect ratio (aspect-video)

## Notes

- If a screenshot is not found, a placeholder with an icon will be automatically shown
- Images are automatically optimized through Next.js Image component
- The first image is loaded with priority for better performance
