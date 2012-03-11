package koch;

import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.Polygon;
import java.util.Random;

public class SnowFlake {
	
	private int[] xCoordinates;
	private int[] yCoordinates;
	private int pointsQntd;
	private Polygon snowFlake;
	private Random random = new Random();
	private Color outlineColor = Color.BLACK;
	private Color fillColor = Color.GRAY;
	private boolean isRandom = false; 
	
	public SnowFlake(int[] startingXCoords, int[] startingYCoords) {
		if(startingXCoords.length != startingYCoords.length)
			throw new IllegalArgumentException("xCoords an yCoords sizes dont match, X: "+startingXCoords.length+", Y: "+startingYCoords.length);
		xCoordinates = startingXCoords;
		yCoordinates = startingYCoords;
		pointsQntd = startingXCoords.length;
		snowFlake = new Polygon(startingXCoords, startingYCoords, startingXCoords.length);
	}
	
	public void iterate(){
		/*
		 * 1__________2
		 * 
		 *       3  
		 *      /\
		 * 1__2/  \4__5
		 */
		
		int newQntd = pointsQntd * 5;
		int[] newXCoords = new int[newQntd];
		int[] newYCoords = new int[newQntd];
		int newCoordsCount = 0;
		for(int i=0; i< pointsQntd; i++){
			int p1X = xCoordinates[i]; 
			int p1Y = yCoordinates[i];
			int p2X = xCoordinates[(i+1)%pointsQntd];
			int p2Y = yCoordinates[(i+1)%pointsQntd];
			
			float oneThirdLineX = (p2X - p1X)/3;
			float oneThirdLineY = (p2Y - p1Y)/3;
			int np1X = (int) Math.abs(p1X+oneThirdLineX);
			int np1Y = (int) Math.abs(p1Y+oneThirdLineY);
			
			float middlePointX = (p1X+((p2X - p1X)/2));
			float middlePointY = (p1Y+((p2Y - p1Y)/2));
				
			double ang = 0;
			double deg180 = Math.PI;
			double deg90 = deg180/2;
			
			if(p2X-p1X!=0){
				float angCoef = (p2Y-p1Y)/(p2X-p1X);
				if(angCoef != 0){
					ang = (1/Math.tan(angCoef))+deg90;
				}
			}else{
				ang = deg90;
			}
			
			double triangSideSize = Math.sqrt( Math.pow(oneThirdLineX,2) + Math.pow(oneThirdLineY,2) );
			double xComponent = triangSideSize*Math.sin(ang);
			double yComponent = triangSideSize*Math.cos(ang);
			
			if(p1X>p2X && p1Y>p2Y){
				if(xComponent>0)
					xComponent *= -1;
				if(yComponent<0)
					yComponent *= -1;
			}
			if(p1X>p2X && p1Y<p2Y){
				if(xComponent<0)
					xComponent *= -1;
				if(yComponent<0)
					yComponent *= -1;
			}
			if(p1X<p2X && p1Y>p2Y){
				if(xComponent>0)
					xComponent *= -1;
				if(yComponent>0)
					yComponent *= -1;
			}
			if(p1X<p2X && p1Y<p2Y){
				if(xComponent<0)
					xComponent *= -1;
				if(yComponent>0)
					yComponent *= -1;
			}
			
			if(isRandom() && random.nextBoolean()){
				xComponent*= -1;
				yComponent*= -1;
			}
			
			int np2X = (int)( middlePointX + xComponent);
			int np2Y = (int)( middlePointY + yComponent);			
			
			int np3X = (int) Math.abs(p1X+(oneThirdLineX*2));
			int np3Y = (int) Math.abs(p1Y+(oneThirdLineY*2));
			
			newXCoords[newCoordsCount] = p1X;
			newYCoords[newCoordsCount] = p1Y;
			newCoordsCount++;
			newXCoords[newCoordsCount] = np1X;
			newYCoords[newCoordsCount] = np1Y;
			newCoordsCount++;
			newXCoords[newCoordsCount] = np2X;
			newYCoords[newCoordsCount] = np2Y;
			newCoordsCount++;
			newXCoords[newCoordsCount] = np3X;
			newYCoords[newCoordsCount] = np3Y;
			newCoordsCount++;
			newXCoords[newCoordsCount] = p2X;
			newYCoords[newCoordsCount] = p2Y;
			newCoordsCount++;
		}
		xCoordinates = newXCoords;
		yCoordinates = newYCoords;
		pointsQntd = newCoordsCount;
		
		snowFlake = new Polygon(xCoordinates, yCoordinates, pointsQntd);
	}
	
	@Override
	public String toString() {
		String s = "{ ";
		for(int i=0;i<pointsQntd;i++)
			s = s+ " ("+xCoordinates[i]+","+yCoordinates[i]+") ";
		s = s+ " }";
		return s;
	}
	
	public void paint(Graphics2D g){
		g.setColor(getOutlineColor());
		g.draw(snowFlake);
		g.setColor(getFillColor());
		g.fillPolygon(snowFlake);
	}

	public void setOutlineColor(Color outlineColor) {
		this.outlineColor = outlineColor;
	}

	public Color getOutlineColor() {
		return outlineColor;
	}

	public void setFillColor(Color fillColor) {
		this.fillColor = fillColor;
	}

	public Color getFillColor() {
		return fillColor;
	}

	public void setRandom(boolean isRandom) {
		this.isRandom = isRandom;
	}

	public boolean isRandom() {
		return isRandom;
	}
}
