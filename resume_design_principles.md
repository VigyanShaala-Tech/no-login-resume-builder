# Resume Design Principles & Best Practices
*Based on lessons learned from Resumake Classic and Academic with Shaded Headers templates*

## **1. Section Header Design Principles**

### **1.1 Header-to-Line Relationship**
- **Optimal Spacing**: Small gap between header text and underline (not touching, but close)
- **Line Thickness**: 1.26px provides perfect balance - visible but not overwhelming
- **Negative Margin Technique**: Use `-mt-0.25` to create tight, underline-style spacing
- **Consistency**: All section headers should have identical line thickness and spacing

### **1.2 Typography for Headers**
- **Line Height**: `line-height: 1` removes default spacing that creates unwanted gaps
- **Font Weight**: Bold (700) for clear hierarchy
- **Small Caps**: Use `font-variant: small-caps` for professional appearance
- **Color**: Dark grey (#333333) instead of pure black for softer, more elegant look

### **1.3 Header Structure**
```css
.resumake-classic-section-header {
  font-variant: small-caps;
  font-size: 1.125rem;
  font-weight: 700;
  color: #333333;
  margin-bottom: 0.025rem;
  line-height: 1;
  padding-bottom: 0;
  border-bottom: none;
  margin-top: 0;
}
```

## **2. Content Spacing & Layout**

### **2.1 Section Spacing**
- **Tight Content**: Use `line-height: 1.2` for description text
- **Paragraph Spacing**: `margin-bottom: 0.25rem` for compact paragraphs
- **Section Margins**: `mb-0` on sections to eliminate excessive spacing
- **Item Spacing**: `space-y-0` for tight item layouts

### **2.2 Text Hierarchy**
- **Institution Names**: Bold (#333333) for primary information
- **Positions/Titles**: Italic (#374151) for secondary information
- **Dates/Locations**: Smaller, lighter text (#6b7280) for tertiary information
- **Descriptions**: Regular weight (#333333) for body text

## **3. Visual Elements**

### **3.1 Bullet Points**
- **Custom Bullets**: Use `::before` pseudo-elements for consistent styling
- **Bullet Size**: 0.25rem diameter for subtle but visible bullets
- **Bullet Color**: Match text color (#333333)
- **Alignment**: Proper vertical alignment with text baseline

### **3.2 Shaded Headers (Academic Template)**
- **Background**: Light grey (#f3f4f6) for subtle emphasis
- **Border**: Dark border (#000000) for definition
- **Padding**: Minimal padding (0.1rem 0.5rem) for compact design
- **Extension**: Extend slightly beyond content edges for visual impact

### **3.3 Lines & Separators**
- **Consistency**: All horizontal lines should have identical properties
- **Thickness**: 1.26px for optimal visibility
- **Color**: Black for strong contrast
- **Spacing**: Use negative margins for tight integration with headers

## **4. Color System**

### **4.1 Primary Colors**
- **Primary Blue**: #2c4869 (for buttons, links, accents)
- **Secondary Green**: #69ab4a (for highlights)
- **Text Primary**: #333333 (dark grey, not pure black)
- **Text Secondary**: #374151 (medium grey)
- **Text Tertiary**: #6b7280 (light grey)

### **4.2 Background Colors**
- **Main Background**: White (#ffffff)
- **Shaded Areas**: #f3f4f6 (very light grey)
- **Button Background**: #2c4869 (primary blue)

## **5. Form Design Principles**

### **5.1 Button Consistency**
- **Primary Buttons**: Blue background (#2c4869) with white text
- **Hover States**: Darker blue (#1e3a54) for interaction feedback
- **Select Dropdowns**: Match primary button styling
- **Border Radius**: Consistent rounded corners across all interactive elements

### **5.2 Input Styling**
- **Background**: White with proper contrast
- **Borders**: Subtle grey borders (#e2e8f0)
- **Focus States**: Blue ring (#2c4869) for accessibility
- **Placeholder Text**: Light grey (#9ca3af)

## **6. Typography System**

### **6.1 Font Hierarchy**
- **Headers**: 1.125rem (18px) for section titles
- **Sub-headers**: 1rem (16px) for institution names
- **Body Text**: 0.875rem (14px) for descriptions
- **Small Text**: 0.75rem (12px) for dates, locations

### **6.2 Font Families**
- **Serif Headers**: 'Times', 'Times New Roman', serif for academic/professional look
- **Sans-serif Body**: System fonts for readability
- **Consistency**: Use same font family within each template type

## **7. Layout Principles**

### **7.1 Content Width**
- **Optimal Width**: Max-width containers for readability
- **Margins**: Consistent padding (8px) around content
- **Grid Systems**: Use CSS Grid for skills and multi-column layouts

### **7.2 Information Architecture**
- **Left-to-Right Flow**: Company/Institution on left, dates on right
- **Top-to-Bottom Hierarchy**: Position → Company → Location → Dates
- **Consistent Spacing**: Uniform gaps between information levels

## **8. Accessibility & Usability**

### **8.1 Color Contrast**
- **Text on White**: Minimum 4.5:1 contrast ratio
- **Interactive Elements**: Clear hover and focus states
- **Color Independence**: Information not conveyed by color alone

### **8.2 Readability**
- **Line Length**: 60-80 characters for optimal reading
- **Line Height**: 1.2-1.4 for body text
- **Font Size**: Minimum 12px for all text

## **9. Template-Specific Adaptations**

### **9.1 Modern Templates**
- **Clean Lines**: Minimal borders and separators
- **White Space**: Generous spacing for modern feel
- **Color Accents**: Strategic use of primary colors

### **9.2 Classic Templates**
- **Traditional Layout**: Centered headers, structured sections
- **Formal Typography**: Serif fonts, small caps
- **Subtle Elements**: Understated lines and borders

### **9.3 Creative Templates**
- **Visual Interest**: Gradients, colored sections
- **Bold Typography**: Larger fonts, varied weights
- **Colorful Elements**: Strategic use of brand colors

## **10. Implementation Guidelines**

### **10.1 CSS Best Practices**
- **Specificity**: Use targeted selectors to avoid conflicts
- **!important**: Use sparingly, only for critical overrides
- **Variables**: Use CSS custom properties for consistent theming
- **Responsive**: Ensure designs work across different screen sizes

### **10.2 Component Structure**
- **Semantic HTML**: Use proper heading hierarchy
- **Accessibility**: Include ARIA labels and roles
- **Performance**: Optimize CSS for rendering speed

## **11. Quality Assurance Checklist**

### **11.1 Visual Consistency**
- [ ] All section headers have identical styling
- [ ] Line thickness is consistent (1.26px)
- [ ] Spacing follows established patterns
- [ ] Colors match the defined palette

### **11.2 Typography**
- [ ] Font sizes follow the hierarchy
- [ ] Line heights are appropriate for content type
- [ ] Text colors provide sufficient contrast
- [ ] Font families are consistent within templates

### **11.3 Layout**
- [ ] Content is properly aligned
- [ ] Spacing is consistent between sections
- [ ] Information hierarchy is clear
- [ ] Responsive behavior works correctly

### **11.4 Interactive Elements**
- [ ] Buttons have consistent styling
- [ ] Hover states provide clear feedback
- [ ] Focus states are visible
- [ ] Form elements match design system

---

*This document serves as the foundation for maintaining design consistency across all resume templates while preserving their unique characteristics.*

