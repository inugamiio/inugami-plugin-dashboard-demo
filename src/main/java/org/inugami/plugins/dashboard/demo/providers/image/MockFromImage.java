/* --------------------------------------------------------------------
 *  Inugami  
 * --------------------------------------------------------------------
 * 
 * This program is free software: you can redistribute it and/or modify  
 * it under the terms of the GNU General Public License as published by  
 * the Free Software Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful, but 
 * WITHOUT ANY WARRANTY; without even the implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU 
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License 
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
package org.inugami.plugins.dashboard.demo.providers.image;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.imageio.ImageIO;

import org.inugami.api.exceptions.Asserts;
import org.inugami.api.exceptions.services.ProviderException;
import org.inugami.api.loggers.Loggers;
import org.inugami.api.models.Gav;
import org.inugami.api.models.data.graphite.GraphiteTarget;
import org.inugami.api.models.data.graphite.GraphiteTargets;
import org.inugami.api.models.events.SimpleEvent;
import org.inugami.api.processors.ClassBehavior;
import org.inugami.api.processors.ConfigHandler;
import org.inugami.api.providers.Provider;
import org.inugami.api.providers.ProviderRunner;
import org.inugami.api.providers.concurrent.FutureData;
import org.inugami.api.providers.concurrent.FutureDataBuilder;
import org.inugami.api.providers.task.ProviderFutureResult;
import org.inugami.api.providers.task.ProviderFutureResultBuilder;
import org.inugami.api.tools.CalendarTools;
import org.inugami.core.providers.graphite.GraphiteProvider;
import org.inugami.core.providers.mock.MockJsonHelper;

public class MockFromImage implements Provider {
    
    // =========================================================================
    // ATTRIBUTES
    // =========================================================================
    private static final String             DEFAULT_PATH_PREFIX = "/META-INF/mock/";
    
    private final String                    name;
    
    private final MockJsonHelper            mockJsonHelper      = new MockJsonHelper();
    
    private final Map<String, List<Double>> MOCK                = new HashMap<>();
    
    // =========================================================================
    // CONSTRUCTORS
    // =========================================================================
    public MockFromImage(final ClassBehavior classBehavior, final ConfigHandler<String, String> config,
                         final ProviderRunner providerRunner) {
        name = classBehavior.getName();
        final List<String> imagesPath = config.grabValues("images");
        Asserts.notNull("MockFromImage provider must have images path defined!", imagesPath);
        
        for (final String path : imagesPath) {
            initializeMockImage(config.applyProperties(path));
        }
    }
    
    protected MockFromImage() {
        name = null;
    }
    
    // =========================================================================
    // INITIALIZE
    // =========================================================================
    private void initializeMockImage(final String path) {
        final String targetName = resolveTargetName(path);
        final List<Double> data = readImage(path);
        MOCK.put(targetName, data);
    }
    
    protected String resolveTargetName(final String path) {
        Asserts.isTrue(path.startsWith(DEFAULT_PATH_PREFIX));
        final String fileName = path.substring(DEFAULT_PATH_PREFIX.length(), path.lastIndexOf('.'));
        return fileName.replaceAll("[.\\/]", "-");
    }
    
    protected List<Double> readImage(final String path) {
        final List<Double> data = new ArrayList<>();
        BufferedImage image = null;
        
        try {
            image = ImageIO.read(this.getClass().getResource(path));
        }
        catch (final IOException e) {
            Loggers.DEBUG.error(e.getMessage(), e);
            Loggers.PROVIDER.error("[{}] {}", name, e.getMessage());
            throw new MockFromImageFatalException(e.getMessage(), e);
        }
        
        final int height = image.getHeight();
        for (int x = 0; x < image.getWidth(); x++) {
            int cursor = 0;
            
            for (int y = 0; y < image.getHeight(); y++) {
                cursor = y;
                if (image.getRGB(x, y) != -1) {
                    break;
                }
                
            }
            data.add(new Double(height - cursor));
        }
        
        return data;
    }
    
    // =========================================================================
    // METHODS
    // =========================================================================
    @Override
    public <T extends SimpleEvent> FutureData<ProviderFutureResult> callEvent(final T event, final Gav pluginGav) {
        final List<Double> data = MOCK.get(event.getName());
        ProviderFutureResult futureResult = null;
        if (data != null) {
            final Calendar now = CalendarTools.buildCalendarByMin();
            final Calendar startDay = CalendarTools.buildCalendarByMin();
            startDay.set(Calendar.HOUR_OF_DAY, 0);
            startDay.set(Calendar.MINUTE, 0);
            
            final int dataSize = data.size();
            final int diff = (int) ((now.getTimeInMillis() - startDay.getTimeInMillis()) / 60000);
            
            final GraphiteTarget target = new GraphiteTarget();
            target.setTarget(event.getName());
            
            for (int i = 0; i < diff; i++) {
                int cursor = i;
                if (cursor > dataSize) {
                    cursor = 0;
                }
                
                startDay.add(Calendar.MINUTE, 1);
                target.addDatapoint(data.get(cursor), startDay.getTimeInMillis() / 1000);
            }
            
            final ProviderFutureResultBuilder futureResultBuilder = new ProviderFutureResultBuilder();
            futureResultBuilder.addData(new GraphiteTargets(target));
            futureResultBuilder.addEvent(event);
            futureResult = futureResultBuilder.build();
        }
        
        return new FutureDataBuilder<ProviderFutureResult>().addImmediateFuture(futureResult).build();
        
    }
    
    @Override
    public ProviderFutureResult aggregate(final List<ProviderFutureResult> datas) throws ProviderException {
        return mockJsonHelper.aggregate(datas);
    }
    
    // =========================================================================
    // GETTERS & SETTERS
    // =========================================================================
    @Override
    public String getType() {
        return GraphiteProvider.TYPE;
    }
    
    @Override
    public String getName() {
        return name;
    }
}
