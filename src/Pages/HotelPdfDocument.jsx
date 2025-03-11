import React from 'react';
import { Page, Text, View, Document, Image, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: { padding: 20 },
    section: { marginBottom: 10 },
    header: { fontSize: 18, fontWeight: 'bold', marginBottom: 6 },
    text: { fontSize: 12, marginBottom: 4 },
    listItem: { marginLeft: 10, fontSize: 12 },
    image: { width: 200, height: 150, marginBottom: 10 },
    divider: { marginVertical: 10, borderBottom: 1, borderColor: 'gray' },
    table: { display: 'table', width: '100%', borderWidth: 1, marginBottom: 10 },
    tableRow: { flexDirection: 'row' },
    tableCol: { width: '50%', borderWidth: 1, padding: 5 },
    tableHeader: { fontWeight: 'bold', backgroundColor: '#f0f0f0' },
});

const HotelPdfDocument = ({ roomInfo = [], facilitiesInfo = {} }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.section}>
                <Text style={styles.header}>{facilitiesInfo?.basicInformation?.name}</Text>
                <Text style={styles.text}>Property Type: {facilitiesInfo?.basicInformation?.propertyType}</Text>
                <Text style={styles.text}>Location: {facilitiesInfo?.basicInformation?.location?.city}</Text>
                <Text style={styles.text}>Category: {facilitiesInfo?.basicInformation?.category} Star</Text>
                <Text style={styles.text}>Description: {facilitiesInfo?.basicInformation?.description}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.header}>Contact Information</Text>
                <Text style={styles.text}>
                    Front Office: {facilitiesInfo?.contactInformation?.front_office_team?.email} | 
                    {facilitiesInfo?.contactInformation?.front_office_team?.phone?.join(', ') || 'N/A'}
                </Text>
                <Text style={styles.text}>
                    Sales Team: {facilitiesInfo?.contactInformation?.sales_team?.email} | 
                    {facilitiesInfo?.contactInformation?.sales_team?.phone?.join(', ') || 'N/A'}
                </Text>
                <Text style={styles.text}>Website: {facilitiesInfo?.contactInformation?.website || "N/A"}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.header}>Hotel Images</Text>
                {roomInfo?.map((room, roomIndex) => (
                    room?.images?.map((img, imgIndex) => (
                        <Image key={`room-${roomIndex}-img-${imgIndex}`} style={styles.image} src={img} />
                    ))
                ))}
            </View>

            <View style={styles.section}>
                <Text style={styles.header}>Nearby Attractions</Text>
                {facilitiesInfo?.nearbyAttractions?.map((attraction, index) => (
                    <Text key={index} style={styles.text}>
                        {attraction.name} - {attraction.distance} km
                    </Text>
                ))}
            </View>

            <View style={styles.divider} />

            <View style={styles.section}>
                <Text style={styles.header}>Facilities</Text>
                {facilitiesInfo?.generalFacilities?.map((facilityGroup, groupIndex) => (
                    Object.entries(facilityGroup || {}).map(([category, items]) => (
                        Array.isArray(items) && items.length > 0 && (
                            <View key={`${groupIndex}-${category}`}>
                                <Text style={styles.text}>
                                    {category.replace(/_/g, ' ')}:
                                </Text>
                                {items.map((item, itemIndex) => (
                                    <Text key={itemIndex} style={styles.listItem}>- {item}</Text>
                                ))}
                            </View>
                        )
                    ))
                ))}
            </View>

            <View style={styles.divider} />

            <View style={styles.section}>
                <Text style={styles.header}>Meal Types</Text>
                {facilitiesInfo?.mealType?.map((meal, index) => (
                    <Text key={index} style={styles.text}>- {meal.replace(/"/g, '')}</Text>
                ))}
            </View>

            {roomInfo?.map((room, index) => (
                <View key={index} style={styles.section}>
                    <Text style={styles.header}>Room Type: {room.roomType}</Text>
                    <Text style={styles.text}>Room Size: {room.roomSize}</Text>
                    <Text style={styles.text}>Max Adults: {room.maxAdults}</Text>
                    <Text style={styles.text}>Max Children: {room.maxChildren}</Text>
                    <Text style={styles.text}>Total Pax: {room.totalPax}</Text>
                    <Text style={styles.text}>Room Count: {room.roomCount}</Text>

                    <View style={styles.section}>
                        <Text style={styles.header}>Pricing</Text>
                        <View style={styles.table}>
                            <View style={[styles.tableRow, styles.tableHeader]}>
                                <Text style={styles.tableCol}>Type</Text>
                                <Text style={styles.tableCol}>Price ($)</Text>
                            </View>
                            {Object.entries(room.pricing?.EPAI_based_Price || {}).map(([type, price]) => (
                                <View key={type} style={styles.tableRow}>
                                    <Text style={styles.tableCol}>
                                        {type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                    </Text>
                                    <Text style={styles.tableCol}>{price}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.header}>Blackout Date Pricing</Text>
                        <View style={styles.table}>
                            <View style={[styles.tableRow, styles.tableHeader]}>
                                <Text style={styles.tableCol}>Type</Text>
                                <Text style={styles.tableCol}>Duration</Text>
                            </View>
                            {room?.blackoutdatePricing?.map((item, idx) => (
                                <View key={idx} style={styles.tableRow}>
                                    <Text style={styles.tableCol}>{item.durationType}</Text>
                                    <Text style={styles.tableCol}>{item.duration}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
            ))}

            <View style={styles.section}>
                <Text style={styles.header}>Policies</Text>
                <Text style={styles.text}>Check-in: {facilitiesInfo?.policies?.checkIn}</Text>
                <Text style={styles.text}>Check-out: {facilitiesInfo?.policies?.checkOut}</Text>
                <Text style={styles.text}>
                    Cancellation Policy: {facilitiesInfo?.policies?.cancellationPolicy || "N/A"}
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.header}>Supplements</Text>
                {facilitiesInfo?.supplements?.map((supplement, index) => (
                    <Text key={index} style={styles.text}>
                        {supplement.name}: ${supplement.price} per person
                        {supplement.persons && ` (Max ${supplement.persons} persons)`}
                    </Text>
                ))}
            </View>
        </Page>
    </Document>
);

export default HotelPdfDocument;