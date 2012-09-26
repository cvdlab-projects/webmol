# WebMol: 3D Protein Viewer

## Link to Project
http://cvdlab-bio.github.com/webmol/

# Introduction
WebMol is a stand-alone 3D Protein Viewer developed in HTML5 and Javscript with the support of PhiloGL (3D WebGL Framework).
The application is designed to be accessible from Internet and it's compatible with the JSON format of protein provided by the project WebPdb.
It can download the required proteins via a REST interface provided by WebPdb.

# Features
* 3D Rendering and Custom Optimization:
    * Frustum Culling
    * Dynamic Quality of objects dependent on distance
    * Pseudo-Instancing of objects
* Navigation of the scene:
    * Zoom in and Zoom out
    * Panoramic navigation
    * Camera Rotation
    * Reset camera to initial position
    * Atoms are pickable to show information
* Background color can be chosed
* JSON Downloader and Parser to view more protein as possible


# Viewer Type
* Ball and stick
* Stick
* Van der Waals Spheres
* Lines
* Backbone (alone or superimposed)

# Development Team
* Antonio Gallo
* Daniele D'Andrea
* Federico Dell'Osso
* Luca Insola
* Marcin Kwiatkowski