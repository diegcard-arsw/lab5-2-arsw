package edu.eci.arsw.blueprints.model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Representa un plano arquitectónico
 */
public class Blueprint {
    
    private String author;
    private String name;
    private List<Point> points;

    public Blueprint() {
        this.points = new ArrayList<>();
    }

    @JsonCreator
    public Blueprint(@JsonProperty("author") String author, 
                    @JsonProperty("name") String name, 
                    @JsonProperty("points") List<Point> points) {
        this.author = author;
        this.name = name;
        this.points = points != null ? points : new ArrayList<>();
    }

    public Blueprint(String author, String name) {
        this(author, name, new ArrayList<>());
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Point> getPoints() {
        return points;
    }

    public void setPoints(List<Point> points) {
        this.points = points != null ? points : new ArrayList<>();
    }

    public void addPoint(Point point) {
        this.points.add(point);
    }

    public int getPointsCount() {
        return points.size();
    }

    @Override
    public String toString() {
        return "Blueprint{" +
                "author='" + author + '\'' +
                ", name='" + name + '\'' +
                ", points=" + points.size() +
                '}';
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null || getClass() != obj.getClass()) {
            return false;
        }
        Blueprint blueprint = (Blueprint) obj;
        return author.equals(blueprint.author) && name.equals(blueprint.name);
    }

    @Override
    public int hashCode() {
        int result = author.hashCode();
        result = 31 * result + name.hashCode();
        return result;
    }
}