# Resumake.io Templates Design Analysis
## Complete Visual Design Breakdown of 9 LaTeX Templates

### Overview
This document provides a detailed analysis of the visual design characteristics of all 9 resumake.io templates. Each template has distinct typography, spacing, layout, and visual hierarchy approaches.

---

## Template 1: Classic Minimalist

### **Typography & Fonts**
- **Name**: `\Huge \scshape` (Large Small Caps)
- **Section Headers**: `\textsc{}` (Small Caps) with underline
- **Company/Institution**: `\textbf{}` (Bold)
- **Position/Degree**: `\textit{}` (Italic)
- **Body Text**: Standard serif font

### **Layout & Spacing**
- **Page Margins**: 0.8in on all sides
- **Header**: Centered with `\vspace*{-10pt}` negative spacing
- **Section Spacing**: `\vspace{2mm}` between items
- **Line Spacing**: `\vspace{1mm}` for work experience
- **Item Spacing**: `\itemsep 1pt` for bullet points

### **Visual Elements**
- **Section Headers**: Underlined with `\lineunder` command
- **Contact Info**: Separated by `$\cdot$` (centered dots)
- **Alignment**: Left-aligned content with `\hfill` for right alignment
- **Bullet Points**: Custom `\bull` symbol

### **Color Scheme**
- **Primary**: Black text on white background
- **Accent**: No colors used
- **Emphasis**: Typography-based (bold, italic, small caps)

---

## Template 2: Professional with Icons

### **Typography & Fonts**
- **Name**: Split into `\headerfirstnamestyle{}` and `\headerlastnamestyle{}`
- **Section Headers**: `\cvsection{}` with custom styling
- **Contact Info**: FontAwesome icons (`\faEnvelope`, `\faMobile`, `\faMapMarker`)
- **Body Text**: Clean sans-serif

### **Layout & Spacing**
- **Header**: Centered with `\vspace{2mm}` spacing
- **Section Structure**: Uses `\cventries` environment
- **Item Spacing**: `\vspace{-2mm}` and `\vspace{-7mm}` for tight layout
- **Contact Separation**: `|` (pipe) separators

### **Visual Elements**
- **Icons**: FontAwesome icons for contact information
- **Section Headers**: Custom `\cvsection` styling
- **Layout**: Structured with `\cventry` commands
- **Skills**: Tabular format with `\skill{}` styling

### **Color Scheme**
- **Primary**: `awesome-red` color theme
- **Background**: White
- **Text**: Dark gray (`#414141`)
- **Accent**: Red highlights

---

## Template 3: Academic with Shaded Headers

### **Typography & Fonts**
- **Name**: `\Large` bold in tabular format
- **Section Headers**: `\resheading{}` with shaded background
- **Institution**: `\textbf{}` (Bold)
- **Position**: `\textit{}` (Italic)
- **Body**: Standard serif

### **Layout & Spacing**
- **Page Setup**: 7in width, 9.5in height
- **Margins**: -0.25in left/right, -0.3in top
- **Header**: Tabular format with left/right alignment
- **Section Spacing**: `\vspace{-11pt}` for tight headers
- **Item Spacing**: `\vspace{1.5mm}` between entries

### **Visual Elements**
- **Section Headers**: Shaded boxes with `\shaded` environment
- **Border**: 3pt outer border width
- **Shading**: Gray backgrounds (`shadecolor` and `shadecolorB`)
- **Layout**: Uses `\begin{itemize}[leftmargin=*]`

### **Color Scheme**
- **Primary**: Black text
- **Shading**: Gray (`0.75` and `0.93` shades)
- **Background**: White
- **Borders**: Gray borders

---

## Template 4: Modern with Custom Fonts

### **Typography & Fonts**
- **Name**: `\namesection{}` with custom font styling
- **Font Family**: Raleway font family
- **Font Sizes**: 11pt with 14pt line height
- **Section Headers**: `\section{}` with custom styling
- **Subsections**: `\runsubsection{}` and `\descript{}`

### **Layout & Spacing**
- **Header**: `\namesection` command with custom spacing
- **Section Structure**: Uses `\section{}` commands
- **Alignment**: `\raggedright` for left alignment
- **Spacing**: Custom spacing with `\bigskip` and `\medskip`

### **Visual Elements**
- **Custom Commands**: `\namesection`, `\runsubsection`, `\descript`
- **Font Path**: `fonts/raleway/` directory
- **Layout**: Modern, clean structure
- **Typography**: Professional font choices

### **Color Scheme**
- **Primary**: `headings` color variable
- **Background**: White
- **Text**: Standard black
- **Accent**: Color-coded headings

---

## Template 5: Clean and Simple

### **Typography & Fonts**
- **Name**: `\LARGE` size
- **Section Headers**: `\section{}` in uppercase
- **Institution**: `\textbf{}` (Bold)
- **Degree**: `\sl` (Slanted/Italic)
- **Body**: Standard serif

### **Layout & Spacing**
- **Header**: Simple `\name{}` and `\address{}` commands
- **Section Structure**: Basic `\section{}` commands
- **Alignment**: Left-aligned with `\hfill` for right alignment
- **Spacing**: Standard LaTeX spacing

### **Visual Elements**
- **Commands**: `\name{}`, `\address{}`, `\section{}`
- **Layout**: Minimalist approach
- **Structure**: Simple, clean design
- **Typography**: Basic LaTeX commands

### **Color Scheme**
- **Primary**: Black text
- **Background**: White
- **No Colors**: Pure typography-based design

---

## Template 6: Modern with Custom Typography

### **Typography & Fonts**
- **Name**: `\fontsize{\sizeone}{\sizeone}\fontspec[LetterSpace=15]{Montserrat-Regular}` (Uppercase with letter spacing)
- **Contact Info**: `\fontspec[Path = fonts/]{Montserrat-Light}`
- **Section Headers**: `\chap{}` command with uppercase
- **Font Family**: Montserrat font family

### **Layout & Spacing**
- **Header**: Centered with `\vspace{2mm}` spacing
- **Section Structure**: `\chap{}` commands
- **Contact Separation**: `--` (double dash) separators
- **Alignment**: Centered header, left-aligned content

### **Visual Elements**
- **Custom Fonts**: Montserrat font family
- **Letter Spacing**: 15pt letter spacing for name
- **Section Headers**: Chapter-style headers
- **Typography**: Modern, clean font choices

### **Color Scheme**
- **Primary**: Black text
- **Background**: White
- **Typography**: Font-based emphasis

---

## Template 7: Professional with Structured Layout

### **Typography & Fonts**
- **Name**: `\name{}` command
- **Contact Info**: Structured with `\phone{}`, `\email{}`, `\homepage{}`
- **Section Headers**: `\section{}` commands
- **Body**: Standard serif

### **Layout & Spacing**
- **Header**: Structured contact information
- **Section Structure**: Standard `\section{}` commands
- **Contact Format**: Individual commands for each contact type
- **Alignment**: Left-aligned content

### **Visual Elements**
- **Commands**: `\name{}`, `\address{}`, `\phone{}`, `\email{}`, `\homepage{}`
- **Layout**: Structured, professional approach
- **Contact Info**: Organized contact display
- **Typography**: Clean, readable design

### **Color Scheme**
- **Primary**: Black text
- **Background**: White
- **No Colors**: Typography-based design

---

## Template 8: Modern with Sectioned Layout

### **Typography & Fonts**
- **Name**: `\name{}` command
- **Contact Info**: `\address{}` and `\contacts{}` commands
- **Section Headers**: `\cvsection{}` commands
- **Body**: Standard serif

### **Layout & Spacing**
- **Header**: Structured with `\name{}`, `\address{}`, `\contacts{}`
- **Section Structure**: `\cvsection{}` environment
- **Contact Format**: Multi-line contact information
- **Alignment**: Left-aligned with structured layout

### **Visual Elements**
- **Commands**: `\name{}`, `\address{}`, `\contacts{}`, `\cvsection{}`
- **Layout**: Sectioned, organized approach
- **Contact Info**: Multi-line format with `\linebreak`
- **Typography**: Professional, structured design

### **Color Scheme**
- **Primary**: Black text
- **Background**: White
- **No Colors**: Typography-based design

---

## Template 9: Executive with Custom Styling

### **Typography & Fonts**
- **Name**: `\MyName{}` command
- **Section Headers**: `\NewPart{}` commands
- **Contact Info**: `\small` font size
- **Body**: Standard serif

### **Layout & Spacing**
- **Header**: `\MyName{}` with `\bigskip` spacing
- **Section Structure**: `\NewPart{}` commands
- **Contact Format**: Right-aligned with `\hfill`
- **Alignment**: Left-aligned content, right-aligned contact info

### **Visual Elements**
- **Commands**: `\MyName{}`, `\NewPart{}`
- **Layout**: Executive-style formatting
- **Contact Info**: Right-aligned contact information
- **Typography**: Professional, executive appearance

### **Color Scheme**
- **Primary**: Black text
- **Background**: White
- **No Colors**: Typography-based design

---

## Summary of Design Patterns

### **Typography Hierarchy**
1. **Template 1**: Small caps for headers, bold for institutions
2. **Template 2**: Custom name styles, FontAwesome icons
3. **Template 3**: Shaded headers, tabular layout
4. **Template 4**: Custom fonts (Raleway), modern styling
5. **Template 5**: Simple, clean typography
6. **Template 6**: Montserrat fonts, letter spacing
7. **Template 7**: Structured contact commands
8. **Template 8**: Sectioned layout with custom commands
9. **Template 9**: Executive styling with custom commands

### **Layout Approaches**
1. **Centered Headers**: Templates 1, 2, 6
2. **Left-Aligned**: Templates 3, 5, 7, 8, 9
3. **Tabular Layout**: Templates 3, 4
4. **Structured Commands**: Templates 7, 8, 9
5. **Custom Environments**: Templates 2, 8

### **Visual Elements**
1. **Icons**: Template 2 (FontAwesome)
2. **Shading**: Template 3 (Gray backgrounds)
3. **Custom Fonts**: Templates 4, 6 (Raleway, Montserrat)
4. **Color Themes**: Template 2 (Red accent)
5. **Typography Only**: Templates 1, 5, 7, 8, 9

### **Spacing Patterns**
1. **Tight Spacing**: Templates 2, 3 (negative margins)
2. **Standard Spacing**: Templates 1, 5, 7, 8, 9
3. **Custom Spacing**: Templates 4, 6 (font-based)

This analysis provides the foundation for implementing these design patterns in your HTML/CSS-based resume builder.

