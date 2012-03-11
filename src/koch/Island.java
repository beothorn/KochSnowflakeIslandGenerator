package koch;

import java.awt.Color;
import java.awt.Graphics2D;
import java.util.Random;

public class Island {
	private SnowFlake snowFlake;
	
	public Island(int islandComplexity,int width, int height){
		snowFlake = generateSnowFlake(width,height,islandComplexity);
		snowFlake.setOutlineColor(Color.BLACK);
		snowFlake.setFillColor(Color.GREEN);
		snowFlake.setRandom(true);
		
		for(int i=0; i<5;i++)
				snowFlake.iterate();
	}
	
	private SnowFlake generateSnowFlake(int regionWidth, int regionHeight,int points){
		int[] pointsX;
		int[] pointsY;
		
		pointsX = new int[points];
		pointsY = new int[points];
		
		Random random = new Random();
		for (int i = 0; i < pointsX.length; i++) {
			pointsX[i] = random.nextInt(regionWidth);
		}
		for (int i = 0; i < pointsY.length; i++) {
			pointsY[i] = random.nextInt(regionHeight);
		}
		
		return new SnowFlake(pointsX,pointsY);
	}
	
	public void paint(Graphics2D g){
		snowFlake.paint(g);
	}
}
