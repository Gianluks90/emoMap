"use strict"

export default class MarkDownService {

  constructor() {
    
    if (MarkDownService._instance) {
      return MarkDownService._instance;
    }
    MarkDownService._instance = this;

  }

  static instance() {
    return MarkDownService._instance || new MarkDownService();
  }


  markdownToHtml(markdown) {
    let html = markdown
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
    .replace(/\*(.*)\*/gim, '<i>$1</i>');
	return html;   
  }
}