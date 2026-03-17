# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Ecom Visual Studio (电商商品图工坊)** — A web application for cross-border e-commerce product image generation and management. Target platforms: Amazon, Temu, Mercado Libre, Shopify.

## Status

This project is in the **planning phase**. The repository contains a product requirements document (`产品需求文档.md`) but no source code or tooling yet.

## Planned Core Features (MVP)

- Image upload and preprocessing (background removal, straightening, white-border removal)
- Standard product image generation (white-background, dimension-annotated, scene images)
- Image quality detection
- AI-powered listing copy/title generation (multimodal)
- Task and history management with preview/download
- Prompt template system for e-commerce categories
- Multi-model API integration (OpenAI, Anthropic, Gemini protocols)

## Planned Architecture

Three-layer design from the PRD:
- **Model Adapter Layer** — configurable model providers with custom `base_url`, `api_key`, `model_name`
- **Capability Abstraction Layer** — text-to-image, image-to-image, multimodal recognition, copy generation
- **Business Orchestration Layer** — task workflows combining multiple capabilities

## Key Reference

- `产品需求文档.md` — Full product requirements document (in Chinese), ~779 lines covering features, UI specs, API design, and architecture
